import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { dummyOrders } from '../assets/assets';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency } = useAppContext();

  const fetchMyOrders = async () => {
    // Simulate API fetch
    setMyOrders(dummyOrders);
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto mt-16">
        <div className='mb-6'>
               <h2 className="text-3xl font-bold mb-2">My Orders</h2>
        <div className='w-16 h-0.5 bg-green-600 rounded-full'></div>
        </div>
   

      {myOrders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-8">
          {myOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-200 shadow-md rounded-xl p-6 hover:shadow-lg transition bg-white"
            >
              {/* Order Summary */}
              <div className="mb-4 space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Order ID:</span> {order._id}</p>
                <p><span className="font-medium">Payment:</span> {order.paymentType}</p>
                <p><span className="font-medium">Total Amount:</span> {currency} {order.amount}</p>
                <p><span className="font-medium">Status:</span> {order.status}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      </div>
                    </div>

                    <div className="ml-auto text-sm text-gray-700 space-y-1">
                      <p>Quantity: {item.quantity || 1}</p>
                      <p className='font-bold'>
                        Amount:{' '}
                        <span className="font-semibold text-green-500">
                          {currency}
                          {item.product.offerPrice * item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
