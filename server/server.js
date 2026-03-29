import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import agentRouter from './routes/agentRoute.js';

const app= express();

const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();


// Allow multiple origins
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    process.env.FRONTEND_URL // To be set to your Vercel URL
];


//Middleware Config
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // Or if the origin matches our allowed list or Vercel patterns
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.get('/', (req, res)=> {
    res.send("LeafCart API is running");
})

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/agent',agentRouter)
app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})