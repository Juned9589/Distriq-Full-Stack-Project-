import express from 'express'
import protect from '../middleware/authMiddleware.js'
import eventController from '../controller/eventController.js'
import upload from '../middleware/imageUploadMiddleware.js'
import orderController from '../controller/orderController.js'

const router = express.Router()

router.post("/", protect.forUser, protect.forAdmin, upload.single('eventImage'), eventController.createEvent)
router.get("/", eventController.getEvents)
router.get("/:eid", eventController.getEvent)
router.get("/apply-coupons", orderController.applyCoupon)




export default router