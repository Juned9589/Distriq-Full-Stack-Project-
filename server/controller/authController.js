import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const registerUser = async (req, res) => {

    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {

        res.status(409)
        throw new Error("Fill All DETAILS")
    };

    let emailExist = await User.findOne({ email: email })
    let phoneExist = await User.findOne({ phone: phone })

    if (emailExist || phoneExist) {
        res.status(400)
        throw new Error("USER ALREADY EXIST")
    }

    //Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);


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

    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error("PLEASE FILL ALL DETAILS")
    }

    //check if user exist
    let user = await User.findOne({ email: email })

    if (user && await bcrypt.compare(password, user.password)) {
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
    } else {
        res.status(401)
        throw new Error("Invalid CREDENTIALS")
    }


}
//private controller
const privateController = (req, res) => {
    res.send("Private Controller")
}

// Token Generate
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' })
}




const authController = { registerUser, loginUser, privateController }


export default authController