import express from 'express'
import {
    verifyRazorpay,
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    // placeOrderPaystack,
    verifyPaystack,
    allOrders,
    userOrders,
    updateStatus,
    placeOrderPaystack,
} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/Auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth,allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place', authUser,placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/pay',authUser, placeOrderPaystack )

// User Feature
orderRouter.post('/user', authUser, userOrders) // Change to GET request

// Verify payment 
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
orderRouter.post('/verifyPaystack', authUser, verifyPaystack)

export default orderRouter