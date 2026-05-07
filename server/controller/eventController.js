import * as fs from 'node:fs'
import uploadToCloudinary from '../utils/uploadToCloudinary.js'
import Event from "../models/eventModel.js"

// Create Event
const createEvent = async (req, res) => {

    const { title, description, eventDate, eventLocation, eventArtistName, totalSeats, duration, ticketPrice } = req.body

    if (!title || !description || !eventDate || !eventLocation || !eventArtistName || !totalSeats || !duration || !ticketPrice) {
        res.status(409)
        throw new Error("Please Enter All Details")
    }


    // Check if image file exists
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload an event image");
    }

    //upload image to cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path)


    //Remove from server
    fs.unlinkSync(req.file.path)

    const newEvent = await Event.create({
        user: req.user._id,
        isActive: true,
        title,
        description,
        eventDate,
        eventLocation,
        eventArtistName,
        totalSeats,
        availableSeats: totalSeats,
        duration,
        ticketPrice,
        eventImage: uploadResult.secure_url
    })


    if (!newEvent) {
        res.status(400)
        throw new Error("Event Not Created")
    }

    const populateEvent = await newEvent.populate('user', 'name email')
    res.status(201).json(populateEvent)


}

//getAllEvents 

const getEvents = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    // Find Active Events directly in DB, sort by newest
    const query = Event.find({ isActive: true }).sort({ createdAt: -1 });
    
    if (limit > 0) {
        query.limit(limit);
    }

    const activeEvents = await query;

    if (!activeEvents || activeEvents.length === 0) {
        res.status(404);
        throw new Error("No active events found");
    }

    res.status(200).json(activeEvents);
}

//get Single Event

const getEvent = async (req, res) => {

    const event = await Event.findById(req.params.eid)

    if (!event) {
        res.status(404)
        throw new Error("Event Not Found")
    }

    if (!event.isActive) {
        res.status(404)
        throw new Error('Events Is Not Active Yet')
    }

    res.status(200).json(event)
}



const eventController = { createEvent, getEvents, getEvent }


export default eventController