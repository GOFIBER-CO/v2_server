import axios from "axios"


const baseUrl = 'http://localhost:4000/api/v2'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers!.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('user') || 'null')?.jwtToken || ''
    }`
    return config
})

export const login = async (username: string, password: string) => axiosInstance.post(`/auth/login`, {
    username: username, 
    password: password
})

export const getUserSurplus = () =>
    axiosInstance.get(`/users/balance`)

export const getUserDetail = () => axiosInstance.get('/users/detail')