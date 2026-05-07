import axios from 'axios'

const API_URL = "/api/auth"

const register = async (formData) => {

    const response = await axios.post(API_URL + "/register", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const login = async (formData) => {
    const response = await axios.post(API_URL + "/login", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const getMe = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/me", config)
    // Update localStorage with latest data if needed, but keep the token
    const oldUser = JSON.parse(localStorage.getItem('user'))
    const updatedUser = { ...oldUser, ...response.data }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    return updatedUser
}

const authService = { register, login, getMe }

export default authService