import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'

const Orders = () => {
const { currency } = useAppContext()
const [orders, setOrders] = useState([])

const fetchOrders = async () => {
setOrders(dummyOrders)
}

useEffect(() => {
fetchOrders()
}, [])

return ( <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50"> <div className="max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-10 space-y-6"> <h2 className="text-xl font-semibold text-gray-800">Orders List</h2>


    {orders.map((order, index) => (
      <div
        key={index}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-5 rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {/* Items */}
        <div className="flex gap-4 flex-wrap md:flex-nowrap md:max-w-xs">
          <img
            className="w-12 h-12 object-cover"
            src={assets.box_icon}
            alt="box icon"
          />
          <div>
            {order.items.map((item, idx) => (
              <p key={idx} className="text-gray-800 text-sm md:text-base">
                {item.product.name}{' '}
                <span className="text-green-600 font-medium">
                  × {item.quantity}
                </span>
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
        <p className="font-semibold text-lg text-gray-700">
          {currency}
          {order.amount}
        </p>

        {/* Payment Info */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Method:</span>{' '}
            {order.paymentType}
          </p>
          <p>
            <span className="font-medium">Date:</span>{' '}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Payment:</span>{' '}
            {order.isPaid ? (
              <span className="text-green-600 font-semibold">Paid</span>
            ) : (
              <span className="text-red-500 font-semibold">Pending</span>
            )}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


)
}

export default Orders

