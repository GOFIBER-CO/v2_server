import ICreateNewService from '@/interfaces/ICreateNewService'
import axios from 'axios'

const baseUrl = 'http://localhost:4000/api/v1'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    config.headers!.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('user') || 'null')?.jwtToken || ''
    }`
    return config
})

export const login = async (username: string, password: string) =>
    axiosInstance.post(`/auth/login`, {
        username: username,
        password: password,
    })

export const getUserSurplus = () => axiosInstance.get(`/users/balance`)

export const getUserDetail = () => axiosInstance.get('/users/detail')

export const getOrdersViettell = (
    pageIndex: number,
    userName: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/client-order/getpaging?pageIndex=${pageIndex}&search=${userName}&pageSize=${pageSize}`
    )

export const getpagingClientTicketViettel = (
    pageIndex: number,
    pageSize: number,
    search: string
) =>
    axiosInstance.get(
        `/client-ticket/getpaging?pageIndex=${pageIndex}&search=${search}&pageSize=${pageSize}`
    )

export const createNewService = (data: ICreateNewService) =>
    axiosInstance.post(`/services/create-new-service`, data)

export const getProductDetailForConfig = (id: string) =>
    axiosInstance.get(`/products/product-detail-for-config/${id}`)
