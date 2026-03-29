import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import agentRouter from './routes/agentRoute.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');

const app= express();
app.set('trust proxy', 1); // Trust Render's proxy for secure cookies

const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();


// Allow multiple origins
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://leafcart-ivory.vercel.app/'// To be set to your Vercel URL
];


//Middleware Config
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'https://leafcart-ivory.vercel.app',
        'https://leafcart-frontend.vercel.app'
    ],
    credentials: true
}));

app.get('/', (req, res)=> {
    res.send("LeafCart API is running");
})

// Serve Static Frontend
app.use(express.static(clientDistPath));

app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/agent',agentRouter)

// Wildcard for React Router support
app.use((req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});
app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})