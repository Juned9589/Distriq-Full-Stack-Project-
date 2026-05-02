import axios from "axios"

const API_URL = "/api/order"

const fetchTickets = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, options)
    return response.data
}

const fetchTicket = (tid, token) => { }

const bookTicket = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(`/api/order/${formData.eventId}`, formData, options)

    return response.data

}

const cancelTicket = async (tid, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put("/api/order/" + tid, {}, options)

    return response.data
}

const checkCoupon = async (couponCode) => {
    const response = await axios.post("/api/coupons/apply", couponCode)
    return response.data
}


const orderService = { fetchTickets, fetchTicket, bookTicket, cancelTicket, checkCoupon }

export default orderService