import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const registerUser = async (req, res) => {

    const { name, phone, password } = req.body
    const email = req.body.email.toLowerCase();

    if (!name || !email || !phone || !password) {
        res.status(400)
        throw new Error("Fill All DETAILS")
    };

    let emailExist = await User.findOne({ email: email })
    let phoneExist = await User.findOne({ phone: phone })

    if (emailExist || phoneExist) {
        res.status(400)
        throw new Error("USER ALREADY EXIST")
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword
    })

    if (!user) {
        res.status(400)
        throw new Error("User Not Found")
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        credits: user.credits,
        token: generateToken(user._id),
        createdAt: user.createdAt
    })

}


const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body
        email = email.toLowerCase(); // Case-insensitive login
        console.log("Login Request Received for:", email);

        if (!email || !password) {
            res.status(400); // 400 is better for missing fields
            throw new Error("PLEASE FILL ALL DETAILS")
        }

        // check if user exist
        const user = await User.findOne({ email: email })

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match result:", isMatch);

            if (isMatch) {
                res.status(200).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    isAdmin: user.isAdmin,
                    isActive: user.isActive,
                    credits: user.credits,
                    token: generateToken(user._id),
                    createdAt: user.createdAt
                })
                return;
            }
        }
        
        res.status(401)
        throw new Error("Invalid CREDENTIALS")
    } catch (error) {
        console.error("Login Error:", error);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
    }
}
// Get Current User Profile
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    res.status(200).json(user);
};

//private controller
const privateController = (req, res) => {
    res.send("Private Controller")
}

// Token Generate
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}




const authController = { registerUser, loginUser, privateController, getMe }


export default authController