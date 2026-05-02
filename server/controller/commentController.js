import Comment from "../models/commentModel.js"
import Event from "../models/eventModel.js"

const getComments = async (req, res) => {

    const eventId = req.params.eid

    const comment = await Comment.find({ event: eventId }).populate('user').populate('event')

    if (!comment) {
        res.status(404)
        throw new Error("Comments Not Found")
    }
    res.status(200).json(comment)
}


const addComment = async (req, res) => {

    const { text, rating } = req.body

    if (!text) {
        res.status(409)
        throw new Error("Please Enter Text ")
    }

    if (!rating) {
        res.status(409)
        throw new Error("Please Enter Rating ⭐")
    }

    const eventId = req.params.eid
    const userId = req.user._id

    const event = await Event.findById(eventId)

    if (!event) {
        res.status(404)
        throw new Error("Event Not Found")
    }
    const newComment = await Comment({
        user: userId,
        event: eventId,
        text: text,
        rating: rating
    })


    await newComment.save()
    await newComment.populate('user')
    await newComment.populate('event')



    res.status(200).json(newComment)


}



const commentController = { getComments, addComment }


export default commentController