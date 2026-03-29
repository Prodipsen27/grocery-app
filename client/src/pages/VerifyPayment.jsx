import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VerifyPayment = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const { axios, navigate, clearCartLocal } = useAppContext();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const { data } = await axios.post("/api/order/verify-stripe", {
                    orderId,
                    success,
                });

                if (data.success) {
                    clearCartLocal(); // clears UI without overwriting DB
                    toast.success("Payment successful! Your order has been placed.");
                    navigate("/my-orders");
                } else {
                    toast.error("Payment cancelled. Your order was not placed.");
                    navigate("/cart");
                }
            } catch (error) {
                toast.error(error.message);
                navigate("/cart");
            }
        };

        if (orderId) {
            verifyPayment();
        }
    }, [orderId, success]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Verifying your payment...</p>
            </div>
        </div>
    );
};

export default VerifyPayment;
