// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {
//    try {
//        const authHeader = req.headers.authorization;
       
//        if (!authHeader?.startsWith('Bearer ')) {
//            return res.status(401).json({
//                success: false,
//                message: 'Authorization header missing/invalid'
//            });
//        }

//        const token = authHeader.split(' ')[1]; // Extract from Authorization header
//        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
//        req.user = { id: decoded.id }; // Attach to request object
//        next();
//    } catch (error) {
//        console.error('Auth Error:', error);
//        res.status(401).json({
//            success: false,
//            message: error.name === 'TokenExpiredError' 
                //   ? 'Session expired' 
//                   : 'Invalid authentication'
//        });
//    }
// };

// export default authUser;

import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
     const {token} = req.headers;

     if (!token) {
        return res.json({success: false, message: 'Not Authorized Login Again'}); 
     }

     try {

      
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
          const user = await userModel.findById(token_decode.id).select('email _id'); // Fetch user from DB

          req.user = user; // Attach user to request object
         //  req.body.user = user; 
        req.body.userId = token_decode.id
        next()

     } catch (error) {
        console.log(error)
        res.json({ success: false, Message: error.message })

     }

}

export default authUser;