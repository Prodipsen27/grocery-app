import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.js';
import Order from './models/order.js';
import User from './models/user.js';
import Address from './models/address.js';

dotenv.config();

const dummyProducts = [
  {
    name: "Fresh Organic Apples",
    description: ["Crisp and juicy organic apples", "Perfect for snacking and baking", "Grown without pesticides"],
    category: "Fruits",
    price: 120,
    offerPrice: 99,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500"]
  },
  {
    name: "Whole Milk",
    description: ["Fresh farm milk", "Rich in calcium and protein", "1 liter pack"],
    category: "Dairy",
    price: 80,
    offerPrice: 65,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500"]
  },
  {
    name: "Brown Bread",
    description: ["100% whole wheat bread", "High in fiber", "No preservatives"],
    category: "Bakery",
    price: 50,
    offerPrice: 40,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"]
  },
  {
    name: "Fresh Bananas",
    description: ["Sweet and ripe bananas", "Rich in potassium", "Sold per dozen"],
    category: "Fruits",
    price: 60,
    offerPrice: 49,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500"]
  },
  {
    name: "Organic Eggs",
    description: ["Farm-fresh organic eggs", "Free-range chickens", "Pack of 6"],
    category: "Dairy",
    price: 90,
    offerPrice: 75,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500"]
  },
  {
    name: "Basmati Rice",
    description: ["Premium quality basmati rice", "Long grain aromatic rice", "1 kg pack"],
    category: "Grains",
    price: 150,
    offerPrice: 129,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"]
  },
  {
    name: "Fresh Tomatoes",
    description: ["Vine-ripened tomatoes", "Perfect for salads and cooking", "500g pack"],
    category: "Vegetables",
    price: 40,
    offerPrice: 30,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500"]
  },
  {
    name: "Cheddar Cheese",
    description: ["Aged cheddar cheese", "Rich and creamy taste", "200g block"],
    category: "Dairy",
    price: 180,
    offerPrice: 159,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1618160702438-9b02ab6515c6?w=500"]
  },
  {
    name: "Orange Juice",
    description: ["100% pure orange juice", "No added sugar", "1 liter bottle"],
    category: "Beverages",
    price: 120,
    offerPrice: 99,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"]
  },
  {
    name: "Chicken Breast",
    description: ["Lean chicken breast", "Hormone-free", "500g pack"],
    category: "Meat",
    price: 250,
    offerPrice: 219,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500"]
  },
  {
    name: "Fresh Salmon Fillet",
    description: ["Atlantic salmon fillet", "Rich in Omega-3", "400g piece"],
    category: "Seafood",
    price: 450,
    offerPrice: 399,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500"]
  },
  {
    name: "Organic Honey",
    description: ["Pure organic honey", "Unprocessed and raw", "250g jar"],
    category: "Condiments",
    price: 200,
    offerPrice: 179,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1587049352846-4a24214d91c7?w=500"]
  },
  {
    name: "Pasta Penne",
    description: ["Italian durum wheat pasta", "Perfect for all sauces", "500g pack"],
    category: "Pantry",
    price: 100,
    offerPrice: 79,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500"]
  },
  {
    name: "Olive Oil Extra Virgin",
    description: ["Cold-pressed olive oil", "From Italian olives", "500ml bottle"],
    category: "Pantry",
    price: 350,
    offerPrice: 299,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500"]
  },
  {
    name: "Greek Yogurt",
    description: ["Creamy Greek-style yogurt", "High in protein", "200g cup"],
    category: "Dairy",
    price: 80,
    offerPrice: 65,
    inStock: true,
    image: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500"]
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing products and orders');

    // Insert products
    const products = await Product.insertMany(dummyProducts);
    console.log(`Inserted ${products.length} products`);

    // Find or create dummy users for orders
    let user1 = await User.findOne({ email: 'customer1@example.com' });
    if (!user1) {
      user1 = await User.create({
        name: 'John Doe',
        email: 'customer1@example.com',
        password: 'hashedpassword123',
        cartItems: {}
      });
    }

    let user2 = await User.findOne({ email: 'customer2@example.com' });
    if (!user2) {
      user2 = await User.create({
        name: 'Jane Smith',
        email: 'customer2@example.com',
        password: 'hashedpassword456',
        cartItems: {}
      });
    }

    // Create addresses in database
    const address1 = await Address.findOneAndUpdate(
      { email: 'customer1@example.com' },
      {
        userId: user1._id.toString(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'customer1@example.com',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipcode: '400001',
        country: 'India',
        phone: '1234567890'
      },
      { upsert: true, new: true }
    );

    const address2 = await Address.findOneAndUpdate(
      { email: 'customer2@example.com' },
      {
        userId: user2._id.toString(),
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'customer2@example.com',
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        zipcode: '110001',
        country: 'India',
        phone: '0987654321'
      },
      { upsert: true, new: true }
    );

    // Create dummy orders
    const dummyOrders = [
      {
        userId: user1._id,
        items: [
          { product: products[0]._id, quantity: 2 },
          { product: products[1]._id, quantity: 1 },
          { product: products[3]._id, quantity: 1 }
        ],
        amount: 312,
        address: address1._id,
        status: 'Delivered',
        paymentType: 'COD',
        isPaid: true
      },
      {
        userId: user1._id,
        items: [
          { product: products[5]._id, quantity: 1 },
          { product: products[12]._id, quantity: 2 },
          { product: products[13]._id, quantity: 1 }
        ],
        amount: 586,
        address: address1._id,
        status: 'Shipped',
        paymentType: 'Online',
        isPaid: true
      },
      {
        userId: user2._id,
        items: [
          { product: products[9]._id, quantity: 1 },
          { product: products[10]._id, quantity: 1 }
        ],
        amount: 618,
        address: address2._id,
        status: 'Processing',
        paymentType: 'Online',
        isPaid: true
      },
      {
        userId: user2._id,
        items: [
          { product: products[2]._id, quantity: 3 },
          { product: products[4]._id, quantity: 2 },
          { product: products[7]._id, quantity: 1 }
        ],
        amount: 433,
        address: address2._id,
        status: 'Order Placed',
        paymentType: 'COD',
        isPaid: false
      },
      {
        userId: user1._id,
        items: [
          { product: products[6]._id, quantity: 5 },
          { product: products[8]._id, quantity: 2 }
        ],
        amount: 347,
        address: address1._id,
        status: 'Out for Delivery',
        paymentType: 'Online',
        isPaid: true
      }
    ];

    const orders = await Order.insertMany(dummyOrders);
    console.log(`Inserted ${orders.length} orders`);

    console.log('\nSeed data inserted successfully!');
    console.log(`- ${products.length} products`);
    console.log(`- ${orders.length} orders`);
    console.log(`- 2 dummy users created for orders`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedData();
