import express from 'express'
import protect from '../middleware/authMiddleware.js'
import commentController from '../controller/commentController.js'


const router = express.Router()

router.get("/:eid", commentController.getComments)

router.post("/add/:eid", protect.forUser, commentController.addComment)

export default router                                                                                                                           