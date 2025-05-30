import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets, dummyAddress } from "../assets/assets";

const Cart = () => {
    const {
        products,
        currency,
        cartItems,
        removeFromCart,
        getCartCount,
        updateCartItems,
        navigate,
        getCartAmount
    } = useAppContext();

    const [cartArray, setCartArray] = useState([]);
    const [addresses, setAddresses] = useState(dummyAddress);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]);
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = () => {
        const tempArray = Object.keys(cartItems).map((key) => {
            const product = products.find((item) => item._id === key);
            if (product) {
                return { ...product, quantity: cartItems[key] };
            }
            return null;
        }).filter(Boolean);
        setCartArray(tempArray);
    };

    const placeOrder = async () => {
        // TODO: implement placing order logic
    };

    

    useEffect(()=>{
    if(products.length >0 && cartItems){
        getCart()
    }
},[products, cartItems])


    const tax = parseFloat((getCartAmount() * 0.02).toFixed(2));
    const total = parseFloat((getCartAmount() + tax).toFixed(2));

    return products.length > 0 && cartItems ? (
        <div className="mt-16">
            <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
                <div className="flex-1 max-w-4xl">
                    <h1 className="text-3xl font-medium mb-6">
                        Basket <span className="text-sm text-green-500">{getCartCount()} Items</span>
                    </h1>

                    <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                        <p className="text-left">Product Details</p>
                        <p className="text-center">Subtotal</p>
                        <p className="text-center">Action</p>
                    </div>

                    {cartArray.map((product, index) => (
                        <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                            <div className="flex items-center md:gap-6 gap-3">
                                <div
                                    onClick={() => {
                                        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                        scrollTo(0, 0);
                                    }}
                                    className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
                                >
                                    <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                                </div>
                                <div>
                                    <p className="hidden md:block font-semibold">{product.name}</p>
                                    <div className="font-normal text-gray-500/70">
                                        <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                        <div className="flex items-center">
                                            <p>Qty:</p>
                                            <select
                                                onChange={e => updateCartItems(product._id, Number(e.target.value))}
                                                value={cartItems[product._id]}
                                                className="outline-none ml-1"
                                            >
                                                {Array.from({ length: Math.max(9, product.quantity) }, (_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                            <button
                                onClick={() => removeFromCart(product._id)}
                                className="cursor-pointer mx-auto"
                                aria-label={`Remove ${product.name}`}
                            >
                                <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            navigate("/products");
                            scrollTo(0, 0);
                        }}
                        className="group cursor-pointer flex items-center mt-8 gap-2 text-green-500 font-medium"
                    >
                        <img src={assets.arrow_right_icon_colored} alt="arrow" className="group-hover:-translate-x-1 transition" />
                        Continue Shopping
                    </button>
                </div>

                <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                    <h2 className="text-xl font-medium">Order Summary</h2>
                    <hr className="border-gray-300 my-5" />

                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase">Delivery Address</p>
                        <div className="relative flex justify-between items-start mt-2">
                            <p className="text-gray-500 w-[80%]">
                                {selectedAddress
                                    ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                    : "No address found"}
                            </p>
                            <button
                                onClick={() => setShowAddress(!showAddress)}
                                className="text-green-500 hover:underline cursor-pointer text-sm"
                            >
                                Change
                            </button>
                            {showAddress && (
                                <div className="absolute top-12 left-0 z-10 bg-white border border-gray-300 text-sm w-full shadow-lg">
                                    {addresses.map((address, index) => (
                                        <p
                                            key={index}
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                setShowAddress(false);
                                            }}
                                            className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {address.street}, {address.city}, {address.state}, {address.country}
                                        </p>
                                    ))}
                                    <p
                                        onClick={() => navigate("/add-address")}
                                        className="text-green-500 text-center cursor-pointer p-2 hover:bg-green-100"
                                    >
                                        Add address
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
                        <select
                            onChange={e => setPaymentOption(e.target.value)}
                            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                            value={paymentOption}
                        >
                            <option value="COD">Cash On Delivery</option>
                            <option value="Online">Online Payment</option>
                        </select>
                    </div>

                    <hr className="border-gray-300" />

                    <div className="text-gray-500 mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Price</span><span>{currency}{getCartAmount()}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span><span className="text-green-600">Free</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Tax (2%)</span><span>{currency}{tax}</span>
                        </p>
                        <p className="flex justify-between text-lg font-medium mt-3">
                            <span>Total Amount:</span><span>{currency}{total}</span>
                        </p>
                    </div>

                    <button
                        onClick={placeOrder}
                        className="w-full py-3 mt-6 cursor-pointer bg-green-500 text-white font-medium hover:bg-green-600 transition"
                    >
                        {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default Cart;
