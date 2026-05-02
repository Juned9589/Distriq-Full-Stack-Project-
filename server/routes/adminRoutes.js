import express from 'express'
import adminController from '../controller/adminController.js'
import protect from '../middleware/authMiddleware.js'
import upload from '../middleware/imageUploadMiddleware.js'


const router = express.Router()


router.get("/users", protect.forAdmin, adminController.getAllUsers)

router.get("/events", protect.forAdmin, adminController.getAllEvents)

router.get("/coupons", protect.forAdmin, adminController.getAllCoupons)

router.get("/orders", protect.forAdmin, adminController.getAllOrders)

router.get("/comments", protect.forAdmin, adminController.getAllComments)


router.put("/events/:uid", protect.forAdmin, upload.single("eventImage"), adminController.updateEvent)

router.post("/coupons", protect.forAdmin, adminController.createCoupon)

router.put("/coupons/:cid", protect.forAdmin, adminController.updateCoupons)

router.put("/users/:uid", protect.forAdmin, adminController.updateUser)


export default router