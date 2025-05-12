
import React, { useContext, useState } from 'react';
import Title from '../Components/Title';
import CartTotal from '../Components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
// import paystack from 'react-paystack';

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const { navigate, backendUrl, token, cartItems, getCartAmount, delivery_fee, products, setCartItems } =
    useContext(ShopContext);

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({...data, [name]:value}))
  };

  const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Order Payment",
    description: "Thank you for your order",
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response) => {
      console.log("Payment response:", response);
      try {
        const { data } = await axios.post(
          backendUrl + '/api/order/verifyRazorpay',
          // {
          //   razorpay_order_id: response.razorpay_order_id,
          //   userId: order.userId
          // },
          response,
          { headers: { token } }
        );
        
        if (data.success) {
          setCartItems({});
          navigate('/orders');
          toast.success('Payment Successful');
        } else {
          toast.error(data.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
    // modal: {
    //   ondismiss: () => {
    //     toast.info('Payment window closed');
    //   }
    // }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  const initPaystack = async (order) => {
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: (getCartAmount() + delivery_fee) * 100,// Convert to kobo
      currency: 'NGN',
      name: "Order Payment",
      description: "Thank you for your order",
      order_id: order.id,
      receipt: order.receipt,
      callback: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyPaystack`,
            response,
            { headers: { token} }
          );
          if (data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(data.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error(error);
          toast.error(error.message);
        }
      },
      onClose: () => {
        toast.info('Payment process was closed');
      },
    });
    handler.openIframe();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Current token:", token);

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
         testMode: true // Set to true for testing
      }

      switch (method){
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, {headers: {token}})
          if(response.data.success){
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, {headers: {token}})
          if(responseStripe.data.success){
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(backendUrl  + '/api/order/razorpay', orderData, {headers: {token}})
          if(responseRazorpay.data.success){
            initPay(responseRazorpay.data.order)
            // console.log(responseRazorpay.data.order)
          } else {
            toast.error(responseRazorpay.data.message)
          }
          break;

      case 'paystack':
        const responsePaystack = await axios.post(
          backendUrl + '/api/order/pay', 
          orderData, 
          { 
            headers: { 
              token,
              'X-Test-Mode': 'true'  // Optional: explicit test mode header
            } 
          }
        );

        if(responsePaystack.data.success){
          window.location.replace(responsePaystack.data.authorization_url);
        } else {
          toast.error(responsePaystack.data.message)
        }
        break;
    }
  } catch (error) {
    toast.error(error.message)
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side - Delivery Info */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          type="email"
          required
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <input
          type="text"
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />

        <div className="flex gap-3">
          <input
            type="text"
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <div className="flex gap-3">
          <input
            type="number"
            required
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>

        <input
          type="number"
          required
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side - Cart Summary + Payment Method */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />

          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" alt="Stripe" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="Razorpay" />
            </div>
            <div
              onClick={() => setMethod("paystack")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paystack' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" alt="Paystack" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
        </div>

        <button type="submit" className="bg-black text-white px-16 py-3 text-sm mt-8">
          PLACE ORDER
        </button>
      </div>
    </form>
  );
};

export default PlaceOrder;
