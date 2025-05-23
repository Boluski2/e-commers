import validator from 'validator'
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}



// Route for user Login
const loginUser = async (req, res) => {
    
    try {

        const {    email, password } = req.body;
        // Check if user already exists
        const user = await userModel.findOne({ email });
        if(!user){
            return res.json({success: false, message: "User doesn't exists"})
        }

        // When user id available We match the password
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = createToken(user._id)

         res.json({success: true, token})

        }else{

             res.json({success: false, message: "Invalid credentials"})

        }
        
    } catch (error) {
        
        console.log(error);
        res.json({success:false, message: error.message})

    }

}

// Route for User Registration 
const registerUser = async (req, res) => {

 try {

    const {    name, email, password } = req.body;
    // Check if user already exists or note
    const exists = await userModel.findOne({ email });
    if(exists){
            return res.json({success: false, message: "User already exists"})
    }

    // validating email format & strong password
    if(!validator.isEmail(email)){
        return res.json({success: false, message: "Please enter a valid email"})
    }

    if(password.length < 8){
        return res.json({success: false, message: "Please enter a strong password"})
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // Creating New User
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
    })

    const user = await newUser.save()

    const token = createToken(user._id)
    
    res.json({success:true, token})
    
 } catch (error) {
    console.log(error);
    res.json({success:false, message: error.message})
 }

}


// Route for Admin Login

const adminLogin = async (req, res) => {

    try {
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, token})
        }else{
            res.json({success: false, message: "Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }

}

export {loginUser, registerUser, adminLogin }