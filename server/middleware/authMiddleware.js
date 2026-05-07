import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const verifyToken = async (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if (!user) throw new Error("User not found")
        return user
    }
    throw new Error("No Token Found")
}

const forUser = async (req, res, next) => {
    try {
        req.user = await verifyToken(req)
        next()
    } catch (error) {
        res.status(401)
        next(new Error("Unauthorized Access: " + error.message))
    }
}

const forAdmin = async (req, res, next) => {
    try {
        const user = await verifyToken(req)
        if (user.isAdmin) {
            req.user = user
            next()
        } else {
            res.status(403)
            next(new Error("Unauthorized Access: Admin privileges required"))
        }
    } catch (error) {
        res.status(401)
        next(new Error("Unauthorized Access: " + error.message))
    }
}

const protect = { forAdmin, forUser }

export default protect