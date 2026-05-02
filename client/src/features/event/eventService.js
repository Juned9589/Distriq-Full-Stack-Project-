import axios from "axios"

const API_URL = "/api/events"

const fetchEvents = async (limit) => {
    const url = limit ? `${API_URL}?limit=${limit}` : API_URL;
    const response = await axios.get(url)
    return response.data
}

const fetchSingleEvent = async (eid) => {
    const response = await axios.get(API_URL + `/${eid}`)

    return response.data
}

const fetchEventComments = async (eid) => {
    const response = await axios.get(`/api/comment/${eid}`)
    return response.data
}

const eventService = { fetchEvents, fetchSingleEvent, fetchEventComments }


export default eventService