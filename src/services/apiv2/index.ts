import jwtDecode from "jwt-decode"
import ICreateNewService from '@/interfaces/ICreateNewService'
import axios from 'axios'

const baseUrl = 'http://localhost:4000/api/v1'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    try {
        const jwtToken = JSON.parse(localStorage.getItem('user') || 'null')?.jwtToken
        const decodedToken = jwtDecode<{exp: number, iat: number}>(jwtToken)
    
        if(!decodedToken.exp ||  decodedToken.exp * 1000 < new Date().getTime()){
            localStorage.removeItem('user')
            location.reload()
        }
    
        config.headers!.authorization = `Bearer ${jwtToken}`
    } catch (error) {
        localStorage.removeItem('user')
    }
  
    return config
})

export const login = async (username: string, password: string) => axiosInstance.post(`/auth/login`, {
    username: username,
    password: password
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

export const signup = (data: {
    firstname: string,
    lastname: string,
    country: string,
    address1: string,
    password: string,
    password2: string,
    email: string
    phonenumber: string
}) => axiosInstance.post('/users/register', data)


export const getActionHistoryByUserId = (pageSize: number, pageIndex: number) => axiosInstance.get(`/action-history?pageSize=${pageSize}&pageIndex=${pageIndex}`)

export const getAllActionHistory = (pageSize: number, pageIndex: number) => axiosInstance.get(`/action-history/get-by-user?pageSize=${pageSize}&pageIndex=${pageIndex}`)
export const getpagingClientTicketViettel = (
    pageIndex: number,
    pageSize: number,
    search: string
) =>
    axiosInstance.get(
        `/client-ticket/getpaging?pageIndex=${pageIndex}&search=${search}&pageSize=${pageSize}`
    )

//create Tickets
export const createNewTicket = (data: FormData) =>
    axiosInstance.post('/support/create/', data)

export const getSupportByUserId = (
    pageIndex: number,
    SupportTT: string,
    SupportUT: string,
    supportName: string,
    pageSize: number
) =>
    axiosInstance.get(
        `/support/getpagingSupportByUserId?pageIndex=${pageIndex}&supportTT=${SupportTT}&supportUT=${SupportUT}&search=${supportName}&pageSize=${pageSize}`
    )

export const getpagingSupport = (
    pageIndex: number,
    pageSize: number,
    search: string,
    level: string
) =>
    axiosInstance.get(
        `/support/getpaging?pageIndex=${pageIndex}&search=${search}&pageSize=${pageSize}&level=${level}`
    )

export const getTicketById = (id: string) =>
    axiosInstance.post(`/support/getById`, { supportId: id })

export const updateTicket = (id: string, data: any) =>
    axiosInstance.put(`/support/update/${id}`, data)

//Department

export const createDepartments = (data: any) =>
    axiosInstance.post('/department/create', data)

export const getAllDepartment = (
    pageIndex: number,
    filter: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/department/getPaging?pageIndex=${pageIndex}&search=${filter}&pageSize=${pageSize}`
    )

export const deleteDepartment = (id: string | undefined) =>
    axiosInstance.delete(`/department/delete/${id}`)

    export const editDepartment = (id: string | undefined, data: string) =>
    axiosInstance.put(`/department/update/${id}`, data)

    export const getByIdDepartment = (id: string) =>
    axiosInstance.get(`/department/getById/${id}`)

export const createNewService = (data: ICreateNewService) =>
    axiosInstance.post(`/services/create-new-service`, data)

export const getProductDetailForConfig = (id: string) =>
    axiosInstance.get(`/products/product-detail-for-config/${id}`)

export const getProductDetail = (id: string) =>
    axiosInstance.get(`/products/product-detail/${id}`)