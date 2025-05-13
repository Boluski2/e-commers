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