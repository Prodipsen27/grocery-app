import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  'Order Placed': 'bg-blue-100 text-blue-700',
  'Processing':   'bg-yellow-100 text-yellow-700',
  'Shipped':      'bg-purple-100 text-purple-700',
  'Delivered':    'bg-green-100 text-green-700',
  'Cancelled':    'bg-red-100 text-red-600',
};

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-10 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders List</h2>

        {orders.length === 0 && (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 rounded-xl border bg-white shadow-sm transition ${
              order.status === 'Cancelled' ? 'border-red-200 opacity-75' : 'border-gray-200'
            }`}
          >
            {/* Items */}
            <div className="flex gap-4 flex-wrap md:flex-nowrap md:max-w-xs">
              <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="box icon" />
              <div>
                {order.items.map((item, idx) => (
                  <p key={idx} className="text-gray-800 text-sm md:text-base">
                    {item.product.name}{' '}
                    <span className="text-green-600 font-medium">× {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm text-gray-600 max-w-sm leading-relaxed">
              <p className="text-gray-800 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city},{' '}
                {order.address.state} {order.address.zipcode},{' '}
                {order.address.country}
              </p>
              <p>{order.address.phone}</p>
            </div>

            {/* Amount */}
            <p className={`font-semibold text-lg ${order.status === 'Cancelled' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {currency}{order.amount}
            </p>

            {/* Payment + Status */}
            <div className="text-sm text-gray-600 space-y-1.5">
              <p>
                <span className="font-medium">Method:</span> {order.paymentType}
              </p>
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Payment:</span>{' '}
                {order.status === 'Cancelled' && order.isPaid ? (
                  <span className="text-orange-500 font-semibold">Refunded</span>
                ) : order.isPaid ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-red-500 font-semibold">Pending</span>
                )}
              </p>
              {/* Status Badge */}
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
