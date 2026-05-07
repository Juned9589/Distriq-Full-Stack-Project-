import fs from 'fs'
import User from '../models/userModel.js'
import Event from '../models/eventModel.js'
import Coupon from '../models/couponModel.js'
import Order from '../models/orderModel.js'
import Comment from '../models/commentModel.js'
import uploadToCloudinary from '../utils/uploadToCloudinary.js'

const getAllUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users || [])
}

const updateUser = async (req, res) => {
    let { isActive, credits } = req.body
    const userId = req.params.uid

    const user = await User.findById(userId)
    if (!user) {
        res.status(404)
        throw new Error('User Not Found')
    }

    const updateData = {}
    if (isActive !== undefined) updateData.isActive = isActive
    
    let query = { $set: updateData }
    if (credits !== undefined && credits !== '') {
        query.$inc = { credits: parseInt(credits) }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, query, { new: true })

    if (!updatedUser) {
        res.status(409)
        throw new Error('User Not Updated')
    }
    res.status(200).json(updatedUser)
}

const getAllEvents = async (req, res) => {
    const events = await Event.find().populate('user')
    if (!events) {
        res.status(404)
        throw new Error('Events Not Found')
    }
    res.status(200).json(events)
}

const getAllComments = async (req, res) => {
    const comments = await Comment.find().populate('user').populate('event')
    if (!comments) {
        throw new Error('No comments found')
    }
    res.status(200).json(comments)
}

const getAllOrders = async (req, res) => {
    const orders = await Order.find().populate('user').populate('event')
    if (!orders) {
        res.status(404)
        throw new Error('Orders Not Found')
    }
    res.status(200).json(orders)
}

const createCoupon = async (req, res) => {
    const { couponCode, couponDiscount } = req.body

    if (!couponCode || !couponDiscount) {
        res.status(409)
        throw new Error('Please fill all details')
    }

    const couponExist = await Coupon.findOne({ couponCode })
    if (couponExist) {
        res.status(409)
        throw new Error('Coupon Already Exists')
    }

    const newCoupon = await Coupon.create({ couponCode, couponDiscount })
    if (!newCoupon) {
        res.status(409)
        throw new Error('Coupon Not Created')
    }

    res.status(201).json(newCoupon)
}

const getAllCoupons = async (req, res) => {
    const coupons = await Coupon.find()
    if (!coupons) {
        res.status(404)
        throw new Error('Coupons Not Found')
    }
    res.status(200).json(coupons)
}

const updateCoupons = async (req, res) => {
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.cid, req.body, { new: true })
    if (!updatedCoupon) {
        res.status(409)
        throw new Error('Coupon Not Updated')
    }
    res.status(200).json(updatedCoupon)
}

const updateEvent = async (req, res) => {
    const eventId = req.params.eid
    const updateData = { ...req.body }

    // Handle isActive string → boolean (FormData sends strings)
    if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true
    }

    if (updateData.totalSeats !== undefined) {
        const oldEvent = await Event.findById(eventId)
        if (oldEvent) {
            const diff = parseInt(updateData.totalSeats) - oldEvent.totalSeats
            updateData.availableSeats = Math.max(0, oldEvent.availableSeats + diff)
        }
    }

    if (req.file) {
        const result = await uploadToCloudinary(req.file.path)
        if (result) {
            updateData.eventImage = result.secure_url
        }
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true }
    ).populate('user')

    if (!updatedEvent) {
        res.status(409)
        throw new Error('Event Not Updated')
    }

    res.status(200).json(updatedEvent)
}

const adminController = {
    updateUser,
    getAllUsers,
    getAllEvents,
    getAllCoupons,
    getAllOrders,
    getAllComments,
    updateEvent,
    createCoupon,
    updateCoupons
}

export default adminController