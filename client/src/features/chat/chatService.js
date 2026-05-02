import axios from 'axios'

const API_URL = '/api/chat'

const sendMessage = async (text, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, { text }, config)
    return response.data
}

const chatService = {
    sendMessage
}

export default chatService
