import Coupon from '../models/couponModel.js'
import Event from '../models/eventModel.js'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

const getTickets = async (req, res) => {

    const myTickets = await Order.find({ user: req.user._id }).populate('user').populate('event')

    if (!myTickets || myTickets.length === 0) {
        res.status(404)
        throw new Error("Ticket Not Found")
    }

    res.status(200).json(myTickets)

    // res.send('your All Ticket Is Booked ')
}

const getTicket = async (req, res) => {

    const myTicket = await Order.findById(req.params.tid).populate('user').populate('event')

    if (!myTicket) {
        res.status(404)
        throw new Error("Ticket Not Found")
    }
    res.status(200).json(myTicket)
}

const bookTicket = async (req, res) => {

    const userId = req.user._id

    const { numberOfSeats, couponCode } = req.body

    if (!numberOfSeats) {
        res.status(409)
        throw new Error("Kindly Select Atleast One Seat")
    }

    //Check If Event Exist
    const eventId = req.params.eid


    const event = await Event.findById(eventId)


    if (!event) {
        res.status(404)
        throw new Error("Event Not Found")
    }
    //Check If Seats Available

    if (event.totalSeats < numberOfSeats || numberOfSeats > 5) {
        res.status(409)
        throw new Error("Seats Not Available")
    }
    // Check If user Have Already Booked 5 seats : Todo

    const allPriviousOrder = await Order.find({ event: event._id })

    // filter my orders by event 
    const myOrders = allPriviousOrder.filter((order) => order.user.toString() === userId.toString())

    //Calculate Total Seats Booked

    let myExistingBookedSeats = myOrders
        .filter((order) => order.status !== "cancelled")
        .reduce((acc, order) => acc + order.seats, 0)



    if (myExistingBookedSeats + parseInt(numberOfSeats) > 5) {
        res.status(409)
        throw new Error(`Only 5 Seats Allowed Per User ${5 - myExistingBookedSeats} Seat Available `)
    }

    //check if request is coming with coupon
    let couponExists
    if (couponCode) {
        //check coupon is valid
        couponExists = await Coupon.findOne({ couponCode })

        if (!couponExists) {
            res.status(404)
            throw new Error("Coupon Not Exist")
        }
    }

    const totalBillAmount = couponCode ? (event.ticketPrice - (event.ticketPrice * couponExists.couponDiscount / 100)) * numberOfSeats : event.ticketPrice * numberOfSeats



    //Find User
    const user = await User.findById(userId)

    if (totalBillAmount > user.credits) {
        res.status(409)
        throw new Error("Not Enough Credits")
    }


    let order = await Order.create({
        user: req.user.id,
        event: eventId,
        seats: numberOfSeats,
        status: 'confirm',
        isDiscounted: couponCode ? true : false,
        billedAmount: totalBillAmount
    })


    if (!order) {
        res.status(409)
        throw new Error("Order Not Accepted")
    }


    // Decrease Available Seats
    let updatedSeats = event.totalSeats - numberOfSeats
    await Event.findByIdAndUpdate(event._id, { totalSeats: updatedSeats }, { new: true })
    // await Event.findByIdAndUpdate(event._id, { totalSeats: parseInt(event.totalSeats) - numberOfSeats }, { new: true })


    // //Decrease Credits
    await User.findByIdAndUpdate(userId, { credits: user.credits - totalBillAmount }, { new: true })

    res.status(201).json(order)


}

const cancelTicket = async (req, res) => {
    const ticketId = req.params.tid;

    const ticket = await Order.findById(ticketId);

    if (!ticket) {
        res.status(404);
        throw new Error("Ticket Not Found");
    }

    if (ticket.status === "cancelled") {
        res.status(400);
        throw new Error("Ticket Already Cancelled");
    }

    // 🔐 Authorization check
    if (
        ticket.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        res.status(403);
        throw new Error("Not authorized to cancel this ticket");
    }

    if (ticket.status === "expired") {
        res.status(409);
        throw new Error("Ticket Already Expired");
    }

    const event = await Event.findById(ticket.event);

    if (!event) {
        res.status(404);
        throw new Error("Event Not Found");
    }

    // Increase seats
    await Event.findByIdAndUpdate(event._id, {
        totalSeats: event.totalSeats + ticket.seats,
    });

    // Refund to correct user
    const ticketOwner = await User.findById(ticket.user);

    await User.findByIdAndUpdate(ticket.user, {
        credits: ticketOwner.credits + ticket.billedAmount,
    });

    // Update ticket status
    const updatedTicket = await Order.findByIdAndUpdate(
        ticket._id,
        { status: "cancelled" },
        { new: true }
    );

    res.status(200).json(updatedTicket);
};


const applyCoupon = async (req, res) => {
    const { couponCode } = req.body
    if (!couponCode) {
        return res.status(400).json({ message: "Coupon code is required" })
    }
    let couponExists = await Coupon.findOne({ couponCode })

    if (!couponExists) {
        res.status(401)
        throw new Error("Invalid Coupon")
    }
    res.status(200).json(couponExists)
}



const orderController = {
    bookTicket,
    cancelTicket,
    getTickets,
    getTicket,
    applyCoupon
}

export default orderController