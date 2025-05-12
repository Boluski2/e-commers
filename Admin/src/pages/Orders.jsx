import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from "react-toastify"
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    if (!token){
      return null
    } 
    
    try {
      setLoading(true)
      const response = await axios.post(
        backendUrl + '/api/order/list', 
        {}, 
        { headers: { token } }
      )
      
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Status updated successfully")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
        Order Management
      </h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <img 
            src={assets.parcel_icon} 
            className="w-24 md:w-32 mx-auto mb-4 opacity-50"
            alt="No orders" 
          />
          <p className="text-gray-500 text-sm md:text-base">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-xs md:shadow-sm border border-gray-200 p-3 md:p-6"
            >
              {/* Mobile Top Section */}
              <div className="md:hidden flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={assets.parcel_icon} 
                    className="w-12 h-12 object-contain"
                    alt="Package" 
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {currency}{order.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className="text-xs p-1 border rounded-md"
                >
                  <option value="orderPlaced">Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out For Delivery">Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-6">
                {/* Image - Hidden on mobile */}
                <img 
                  src={assets.parcel_icon} 
                  className="hidden md:block w-16 h-16 object-contain"
                  alt="Package" 
                />

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    {order.items.map((item, index) => (
                      <div 
                        key={index}
                        className="text-sm text-gray-600 break-words"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs"> × {item.quantity} ({item.size})</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800 text-sm md:text-base">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <div className="text-xs md:text-sm text-gray-600 space-y-1">
                      <p className="break-words">{order.address.street},</p>
                      <p>{order.address.city}, {order.address.state}</p>
                      <p>{order.address.country} - {order.address.zipcode}</p>
                      <p>{order.address.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info - Hidden on mobile */}
                <div className="hidden md:block space-y-2 min-w-[160px]">
                  <p className="text-sm">
                    <span className="font-semibold">Items:</span> {order.items.length}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Payment:</span>{" "}
                    <span className={order.payment ? "text-green-600" : "text-red-600"}>
                      {order.payment ? "Done" : "Pending"}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>

                {/* Desktop Amount and Status */}
                <div className="hidden md:block space-y-4 min-w-[160px]">
                  <p className="text-lg font-bold text-right">
                    {currency}{order.amount.toFixed(2)}
                  </p>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="orderPlaced">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Mobile Bottom Section */}
              <div className="md:hidden mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div>
                    <p>Method: {order.paymentMethod}</p>
                    <p className={order.payment ? "text-green-600" : "text-red-600"}>
                      Payment: {order.payment ? "Done" : "Pending"}
                    </p>
                  </div>
                  <p>Items: {order.items.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
// 11:45
export default Orders