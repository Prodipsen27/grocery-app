import Order from "../../models/order.js";
import Product from "../../models/product.js";
import Stripe from "stripe";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.json({ success: false, message: "Invalid quantity: must be a positive integer" });
      }
    }

    // Calculate Amount Using Items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);
    await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType:"COD"
    })
    return res.json({success: true, message: "Order Placed Successfully"})
  } catch(error){
    return res.json({success: false, message: error.message})
  }
}


// Place Order with Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.json({ success: false, message: "Invalid quantity: must be a positive integer" });
      }
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Calculate Amount Using Items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // Add Tax Charge (2%)
    amount += Math.floor(amount * 0.02);

    // Create Order in DB (unpaid) — store sessionId after session creation
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    // Build Stripe line items
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          price_data: {
            currency: "inr",
            product_data: { name: product.name },
            unit_amount: Math.round(product.offerPrice * 100), // paise
          },
          quantity: item.quantity,
        };
      })
    );

    // Add tax as a line item
    const subtotal = amount - Math.floor(amount / 1.02 * 0.02);
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Tax (2%)" },
        unit_amount: Math.round((amount - Math.round(amount / 1.02)) * 100),
      },
      quantity: 1,
    });

    const origin = req.headers.origin || "https://leafcart-ivory.vercel.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/verify-payment?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify-payment?success=false&orderId=${order._id}`,
    });

    // Save session ID to order for refund purposes
    await Order.findByIdAndUpdate(order._id, { stripeSessionId: session.id });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// Verify Stripe Payment : /api/order/verify-stripe
export const verifyStripePayment = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
        return res.json({ success: false, message: "Order not found" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (success === "true") {
      if (!order.stripeSessionId) {
          return res.json({ success: false, message: "Invalid session" });
      }
      
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

      if (session.payment_status === 'paid') {
          await Order.findByIdAndUpdate(orderId, { isPaid: true });
          return res.json({ success: true, message: "Payment successful" });
      } else {
          return res.json({ success: false, message: "Payment not verified by Stripe" });
      }
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId  = req.user.id;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Get All Orders ( for seller / admin ) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    // Show ALL orders (including cancelled) so seller has full visibility
    const orders = await Order.find({}).populate("items.product").sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Cancel Order : /api/order/cancel
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // Ensure the order belongs to this user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Only allow cancellation for early-stage orders
    const cancellableStatuses = ["Order Placed", "Processing"];
    if (!cancellableStatuses.includes(order.status)) {
      return res.json({
        success: false,
        message: `Order cannot be cancelled once it is "${order.status}"`,
      });
    }

    // Update status in DB
    await Order.findByIdAndUpdate(orderId, { status: "Cancelled" });

    // Issue Stripe refund for paid online orders
    if (order.paymentType === "Online" && order.isPaid && order.stripeSessionId) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

        if (session.payment_intent) {
          await stripe.refunds.create({ payment_intent: session.payment_intent });
        }
      } catch (refundError) {
        // Order is already cancelled in DB; log refund failure but don't block response
        console.error("Stripe refund failed:", refundError.message);
        return res.json({
          success: true,
          message: "Order cancelled, but refund failed. Please contact support.",
          refundFailed: true,
        });
      }
      return res.json({ success: true, message: "Order cancelled and refund initiated." });
    }

    return res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
