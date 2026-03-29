
import Product from '../server/models/product.js';
import User from '../server/models/user.js';



// ─── HANDLERS ────────────────────────────────────────────────────────────────

async function handle_search_products({ query }) {
  const results = await Product.find({
  $or: [
    { name: { $regex: query, $options: 'i' } },
    { category: { $regex: query, $options: 'i' } }
  ]
}).limit(5)

  if (results.length === 0) {
    return {
      success: false,
      message: `No products found for "${query}". Try a different search term.`,
      results: [],
    };
  }

  return {
    success: true,
    results: results.map((p) => ({
      product_id: p.id,
      name: p.name,
      price: p.price,
      offerPrice: p.offerPrice,
      category: p.category,
      inStock: p.inStock,
    })),
  };
}

async function handle_add_to_cart({ product_id, quantity = 1, reason = "" }, userId) {
  const user = await User.findById(userId);
  const product = await Product.findById(product_id);

  if (!product) {
    return { success: false, message: `Product ID "${product_id}" not found.` };
  }

  if (!product.inStock) {
    return {
      success: false,
      message: `"${product.name}" is currently out of stock or unavailable. Do NOT suggest alternatives unless asked. Skip this item and notify the user that it could not be added.`,
      outOfStock: true,
      product_id,
    };
  }

  const currentQty = user.cartItems[product_id] || 0;
  const newQty = currentQty + quantity;

  await User.findByIdAndUpdate(userId, {
    cartItems: { ...user.cartItems, [product_id]: newQty }
  });

  return {
    success: true,
    message: `Added ${quantity}x "${product.name}" to cart.`,
    cart_item: {
      product_id,
      name: product.name,
      quantity: newQty,
      unit_price: product.price,
      total_price: newQty * product.price,
      reason,
    },
  };
}

async function handle_remove_from_cart({ product_id, quantity },userId) {
  const user = await User.findById(userId);
  if (!user.cartItems[product_id]) {
    return { success: false, message: `Product "${product_id}" is not in the cart.` };
  }
const currentQty = user.cartItems[product_id];

const updatedCart = { ...user.cartItems };

if (!quantity || quantity >= currentQty) {
  delete updatedCart[product_id];
  await User.findByIdAndUpdate(userId, { cartItems: updatedCart });
  return { success: true, message: `Removed product from cart.` };
} else {
  updatedCart[product_id] = currentQty - quantity;
  await User.findByIdAndUpdate(userId, { cartItems: updatedCart });
  return { success: true, message: `Reduced quantity to ${updatedCart[product_id]}.` };
}

}

async function handle_update_quantity({ product_id, quantity },userId) {
  const user = await User.findById(userId);
//   const cart = user.cartItems;
 if (!user.cartItems[product_id]) {
    return { success: false, message: `Product "${product_id}" is not in the cart.` };
  }


const updatedCart = { ...user.cartItems };

if (quantity <= 0) {
  return handle_remove_from_cart({ product_id }, userId);
} else {
  updatedCart[product_id] = quantity;
  await User.findByIdAndUpdate(userId, { cartItems: updatedCart });
  return { success: true, message: `Updated quantity to ${quantity}.` };
}
  
}

async function handle_get_cart(userId) {

     const user = await User.findById(userId);
       const cart = user.cartItems;
  if (Object.keys(user.cartItems).length === 0) {
    return { success: true, items: [], total: 0, item_count: 0 };
  }
  const productIds = Object.keys(user.cartItems);
const products = await Product.find({ _id: { $in: productIds } });

  let total = 0;
const items = products.map(p => {
  const quantity = user.cartItems[p._id.toString()];
  const item_total = p.offerPrice * quantity;
  total += item_total;
  return {
    product_id: p._id,
    name: p.name,
    price: p.offerPrice,
    quantity,
    item_total
  };
});
return { success: true, items, total, item_count: items.length };
}


// ─── DISPATCHER ───────────────────────────────────────────────────────────────
export async function executeTool(toolName, toolInput, userId) {
  const handlers = {
    search_products:    () => handle_search_products(toolInput),
    add_to_cart:        () => handle_add_to_cart(toolInput, userId),
    remove_from_cart:   () => handle_remove_from_cart(toolInput, userId),
    update_quantity:    () => handle_update_quantity(toolInput, userId),
    get_cart:           () => handle_get_cart(userId),
  };

  const handler = handlers[toolName];
  if (!handler) {
    return { success: false, message: `Unknown tool: "${toolName}"` };
  }

  try {
    return await handler();
  } catch (err) {
    return { success: false, message: `Tool error: ${err.message}` };
  }
}