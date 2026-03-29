import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { dummyProducts } from '../assets/assets';
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.baseURL= import.meta.env.VITE_BACKEND_URL || '';
axios.defaults.withCredentials = true;


export const AppContext = createContext();

export const AppContextProvider = ({children}) =>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    
    // Agent State
    const [agentMessages, setAgentMessages] = useState([]);
    const [agentInput, setAgentInput] = useState('');
    const [agentLoading, setAgentLoading] = useState(false);
    const [agentInitialLoading, setAgentInitialLoading] = useState(true);
    const [agentToolCalls, setAgentToolCalls] = useState([]);
    const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);

    // Tracks whether cartItems was just loaded from server (skip DB sync in that case)
    const cartLoadedFromServer = useRef(false);

// Fetch Seller Status
const fetchSeller = async () => {
  try {
    const { data } = await axios.get('/api/seller/is-auth');
    if (data.success) {
      setIsSeller(true);
    } else {
      setIsSeller(false);
    }
  } catch (error) {
    setIsSeller(false);
    // Don't show error toast for 401 - user simply isn't logged in
    if (error.response?.status !== 401) {
      toast.error(error.message);
    }
  }
};

// Fetch User Auth Status, User Data and Cart Items
const fetchUser = async () => {
  try {
    const { data } = await axios.get('/api/user/is-auth');
    if (data.success) {
      setUser(data.user);
      cartLoadedFromServer.current = true;
      setCartItems(data.user.cartItems || {});
    }
  } catch (error) {
    setUser(null);
    cartLoadedFromServer.current = true;
    setCartItems({});
  }
};

//fetch all product
  // Fetch All Products
const fetchProducts = async () => {
  try {
    const { data } = await axios.get('/api/product/list');

    if (data.success) {
      setProducts(data.products);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

//add product to cart
const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
        cartData[itemId]+=1;
    }else{
        cartData[itemId]=1
    }
    setCartItems(cartData);
    toast.success("Added to cart")
}

//update cart item quantity
const updateCartItems = (itemId, quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId]=quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
}

//remove from cart
const removeFromCart = (itemId)=>{
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
        cartData[itemId]-=1;
        if (cartData[itemId]===0) {
            delete cartData[itemId]
        }
        
    }
    toast.error("Removed from cart");
    setCartItems(cartData)
}

// Clear cart locally without writing to DB (used on logout)
const clearCartLocal = () => {
    cartLoadedFromServer.current = true;
    setCartItems({});
};

//cart item count
const getCartCount = ()=>{
    let totalCount = 0;
    for(const item in cartItems){
        totalCount+=cartItems[item];
    }
    return totalCount;
}

// Total cart amount
const getCartAmount = ()=>{
    let totalAmount = 0;
    for(const items in cartItems){
        let itemInfo = products.find((product)=>product._id===items);
        if (itemInfo && cartItems[items] > 0) {
  totalAmount += itemInfo.offerPrice * cartItems[items];
}

    }
    return Math.floor(totalAmount *100)/100;
}

// Load Agent History
const loadAgentHistory = async () => {
    if(!user) return;
    setAgentInitialLoading(true);
    try {
        const { data } = await axios.get('/api/agent/history');
        if (data.success && data.history && data.history.length > 0) {
            setAgentMessages(data.history.filter(m => m.role === 'user' || m.role === 'model' || m.role === 'assistant'));
        } else {
            setAgentMessages([{ role: 'assistant', content: "Hi there! I'm Leafy.ai, your personal grocery assistant. What are you planning to cook or buy today?" }]);
        }
    } catch (error) {
        if (error.response?.status !== 401) {
            console.error("Failed to load history", error);
        }
        setAgentMessages([{ role: 'assistant', content: "Hi there! I'm Leafy.ai. (Session restored locally)" }]);
    } finally {
        setAgentInitialLoading(false);
    }
};

// Send Message to Agent
const handleAgentSend = async (message) => {
    if (!message.trim() || !user) return;
    
    setAgentMessages(prev => [...prev, { role: 'user', content: message }]);
    setAgentLoading(true);
    setAgentToolCalls([]);

    try {
        const { data } = await axios.post('/api/agent/chat', { message });
        
        if (data.toolCalls && data.toolCalls.length > 0) {
            setAgentToolCalls(data.toolCalls);
            // If the agent modified the cart, strictly re-fetch user cart to sync the UI
            if (data.toolCalls.some(t => ['add_to_cart', 'remove_from_cart', 'update_quantity', 'clear_cart'].includes(t.toolName))) {
                await fetchUser();
            }
        }
        
        if (data.reply) {
            setAgentMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        }
    } catch (error) {
        console.error(error);
        setAgentMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an issue. Please try again later." }]);
    } finally {
        setAgentLoading(false);
    }
};

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])

    //update DB cart items
    useEffect(()=>{
    const updateCart = async ()=>{
        try {
            const { data } = await axios.post('/api/cart/update', {cartItems})
            if (!data.success){
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // If cart was just loaded from server, skip the sync to avoid overwriting DB
    if (cartLoadedFromServer.current) {
        cartLoadedFromServer.current = false;
        return;
    }

    if(user){
        updateCart()
    }
},[cartItems])


    const value = {navigate, user, setUser, isSeller, setIsSeller,showLogout, setShowLogout,products, currency, addToCart,updateCartItems, removeFromCart, cartItems,showUserLogin , setShowUserLogin, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts,fetchUser,setCartItems, clearCartLocal, agentMessages, setAgentMessages, agentInput, setAgentInput, agentLoading, agentInitialLoading, agentToolCalls, loadAgentHistory, handleAgentSend, isAgentDrawerOpen, setIsAgentDrawerOpen}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}