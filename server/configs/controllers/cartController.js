
// /api/cart/PaymentRequestUpdateEvent
import User from "../../models/user.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const { cartItems } = req.body;

    if (!cartItems) {
      return res.json({ success: false, message: "Cart data missing" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true }
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
