import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'



const forUser = async (req, res, next) => {

    try {

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            let token = req.headers.authorization.split(" ")[1]

            let decoded = jwt.verify(token, process.env.JWT_SECRET)


            let user = await User.findById(decoded.id).select("-password")
            req.user = user
            next()
        } else {
            res.status(401)
            throw new Error("Unauthorized Access")
        }

    } catch (error) {
        res.status(401)
        throw new Error("Unauthorized Access : No Token Found")
    }
}

const forAdmin = async (req, res, next) => {

    try {

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            let token = req.headers.authorization.split(" ")[1]

            let decoded = jwt.verify(token, process.env.JWT_SECRET)


            let user = await User.findById(decoded.id).select("-password")
            req.user = user

            if (user.isAdmin) {
                next()
            } else {
                throw new Error('something went terong')
            }

        }
        else {
            res.status(401)
            throw new Error("Unauthorized Access : No Token Found : Admin Access Only ", token)
        }


    } catch (error) {
        res.status(401)
        throw new Error("Unauthorized Access : No Token Found")
    }
}

const protect = { forAdmin, forUser }

export default protect