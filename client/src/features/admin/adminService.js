import axios from "axios"

const API_URL = '/api/admin'

const fetchAllUsers = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + '/users', options)

    return response.data

}

const fetchAllEvents = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + '/events', options)
    return response.data

}


const fetchAllOrders = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + '/orders', options)
    return response.data
}

const fetchAllRatings = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + '/comments', options)

    return response.data
}

const fetchAllCoupons = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + '/coupons', options)
    return response.data
}

const createCoupon = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + '/coupons', formData, options)
    return response.data
}

const adminEventCreate = async (formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post("/api/events", formData, options)
    return response.data
}
const updateEvent = async (id, formData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put("/api/admin/events/" + id, formData, options)
    console.log(response.data)
    return response.data
}

const updateUser = async (id, userData, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put("/api/admin/users/" + id, userData, options)
    return response.data
}

const updateCoupon = async (id, couponData, token) => {
    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.put("/api/admin/coupons/" + id, couponData, options)
    return response.data
}

export const adminService = {
    fetchAllCoupons,
    fetchAllEvents,
    fetchAllOrders,
    fetchAllRatings,
    fetchAllUsers,
    createCoupon,
    adminEventCreate,
    updateEvent,
    updateUser,
    updateCoupon
}

export default adminService