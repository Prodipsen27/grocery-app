import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  'Order Placed': 'bg-blue-100 text-blue-700',
  'Processing':   'bg-yellow-100 text-yellow-700',
  'Shipped':      'bg-purple-100 text-purple-700',
  'Delivered':    'bg-green-100 text-green-700',
  'Cancelled':    'bg-red-100 text-red-600',
};

const CANCELLABLE = ['Order Placed', 'Processing'];

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Failed to fetch orders:", error);
      }
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      const { data } = await axios.post('/api/order/cancel', { orderId });
      if (data.success) {
        toast.success(data.message);
        // Optimistically update status in UI without refetching
        setMyOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

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
              key={order._id}
              className="border border-gray-200 shadow-md rounded-xl p-6 hover:shadow-lg transition bg-white"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Order ID:</span> <span className="font-mono text-xs">{order._id}</span></p>
                  <p><span className="font-medium">Payment:</span> {order.paymentType}</p>
                  <p><span className="font-medium">Total:</span> <span className="font-semibold text-gray-900">{currency}{order.amount}</span></p>
                  <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Status badge + Cancel button */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>

                  {CANCELLABLE.includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={cancellingId === order._id}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === order._id ? 'Cancelling…' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                        <img
                          src={item.product.image[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                      </div>
                    </div>

                    <div className="ml-auto text-sm text-gray-700 space-y-1 text-right">
                      <p>Qty: <span className="font-medium">{item.quantity || 1}</span></p>
                      <p className="font-semibold text-green-600">
                        {currency}{item.product.offerPrice * item.quantity}
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
