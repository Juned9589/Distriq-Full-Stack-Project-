import express from 'express'
import protect from '../middleware/authMiddleware.js'
import adminController from '../controller/adminController.js'
import orderController from '../controller/orderController.js'

const router = express.Router()

// Get all active coupons (for users to see available deals)
router.get("/", protect.forUser, adminController.getAllCoupons)

// Apply a coupon to an order
router.post("/apply", orderController.applyCoupon)

export default router