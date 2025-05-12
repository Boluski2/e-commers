import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe'
import razorpay from 'razorpay'
import paystack from 'paystack-api';


// Global variables
const currency = 'NGN' 
// const currency = 'usd'
const deliveryCharge = 10

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);


// Placing order using cash on delivery method

const placeOrder = async (req, res) => {
    
    try {
        
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // To clear CartData

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: 'Order Placed Successfully' })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }

}

// Placing order using cash on Stripe method

const placeOrderStripe = async (req, res) => {
    try {
        // const userId = req.user.id; 
        const { userId, items, amount, address, currency } = req.body;

         // Force Stripe to use USD and validate amount
    if (currency !== 'USD' || amount < 0.5) {
      return res.status(400).json({
        success: false,
        message: "Stripe requires USD with a minimum of $0.50",
      });
    }
        // const { items, amount, address } = req.body; // ✅ From middleware
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: new Date()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=> ({
            price_data: {
                currency: currency || 'usd',
                product_data: {
                        name: item.name
                },
                unit_amount:  item.price * 100
            },
            quantity: item.quantity
    }))

    line_items.push({
        price_data: {
           currency: currency || 'usd',
            product_data: {
                    name: 'Delivery Charges'
            },
           unit_amount: (currency === 'USD' ? 10 : 10000) * 100, // Also multiply by 100 
        }, 
        quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode: 'payment',
    })
        res.json({success:true, session_url:session.url});
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }
}

// Verify Stripe
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment: true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        }else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }


}




// Placing order using cash on Razorpay method

const placeOrderRazorpay = async (req, res) => {

    try {

        // const userId = req.user.id; 
        const { userId, items, amount, address } = req.body;
       

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Razorpay',
            payment: false,
            date: new Date()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100,
             currency: (currency || 'usd').toUpperCase(), // Use dynamic currency
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if(error){
                console.log(error)
                return res.json({success: false, message: error})
            }
            res.json({success: true, order})
        })

        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }

}

const verifyRazorpay = async (req, res) => {
  
    try {

        const { userId, razorpay_order_id } = req.body 

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if(orderInfo.status === 'paid'){
                await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true});
             // clearing the cartData of the User
                await userModel.findByIdAndUpdate(userId, {cartData: {}})
                res.json({success: true, message: 'Payment Successful'})
        }else{
            res.json({success: false, message: 'Payment Failed'})
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }



}

// All Orders data for Admin Panel

const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success: true, orders})
        
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }
    
}

// All Orders data for Admin Frontend

const userOrders = async (req, res) => {
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({ userId }); 
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// All Orders data for Status from Admin panel

const updateStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:  true, message: "Status Updated"})


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message:  error.message,
        })
    }
    
}

const placeOrderPaystack = async (req, res) => {
    try {
        const isTestMode = req.headers['x-test-mode'] === 'true';
        
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Paystack',
            payment: false,
            date: new Date(),
            testMode: isTestMode  // Track test mode in order
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const paystackResponse = await paystackInstance.transaction.initialize({
            email: req.user.email || 'test@example.com',
            amount: amount * 100, 
            currency: currency.toUpperCase(),
            reference: newOrder._id.toString(),
            callback_url: `${req.headers.origin}/verify-paystack?orderId=${newOrder._id}`,
            // Test mode specific configurations
            ...(isTestMode && {
                channels: ['card'],  // Force card payment in test mode
            })
        });

        res.json({ 
            success: true, 
            authorization_url: paystackResponse.data.authorization_url,
            testMode: isTestMode
        });
    } catch (error) {
        console.error('Paystack Order Initialization Error:', error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};


// Verify Paystack
const verifyPaystack = async (req, res) => {
    try {
        const { reference } = req.body;

        // Verify transaction with Paystack
        const paystackResponse = await paystackInstance.transaction.verify(reference);

        // More flexible success checking for test mode
        const isSuccessful = 
            paystackResponse.data.status === 'success' || 
            paystackResponse.data.status === 'completed' ||
            // Add test mode specific status
            (paystackResponse.data.status === 'pending' && paystackResponse.data.gateway_response === 'Successful');

        if (isSuccessful) {
            const order = await orderModel.findById(reference);

            if (order) {
                order.payment = true;
                order.paymentStatus = 'Completed';
                order.testMode = true;  // Explicitly mark as test mode
                await order.save();

                await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

                res.json({ 
                    success: true, 
                    message: 'Test Payment Successful',
                    testMode: true
                });
            }
        } else {
            res.json({ 
                success: false, 
                message: 'Test Payment Verification Failed',
                testMode: true
            });
        }
    } catch (error) {
        console.error('Paystack Test Mode Verification Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            testMode: true
        });
    }
};


export {
    verifyRazorpay,
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    placeOrderPaystack,
    verifyPaystack,
    allOrders,
    userOrders,
    updateStatus,
};