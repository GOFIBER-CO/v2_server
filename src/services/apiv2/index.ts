import axios from "axios"


const baseUrl = 'http://localhost:4000'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers!.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('user') || 'null')?.jwtToken || ''
    }`
    return config
})