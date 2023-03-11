import jwtDecode from 'jwt-decode'
import ICreateNewService from '@/interfaces/ICreateNewService'
import axios from 'axios'
import INotification from '@/interfaces/INotification'
import INewNotification from '@/interfaces/INewNotification'
import appConfig from '@/config/appConfig'

// const baseUrl =
//     appConfig.ENVIRONMENT == 'development'
//         ? 'http://localhost:4000/api/v1'
//         : appConfig.PROJECT == 'gofiber'
//         ? 'https://system.gofiber.vn'
//         : 'https://api.vietstack.com'

const baseUrl = 'http://localhost:4000/api/v1'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use((config) => {
    try {
        const jwtToken = JSON.parse(
            localStorage.getItem('user') || 'null'
        )?.jwtToken
        const decodedToken = jwtDecode<{ exp: number; iat: number }>(jwtToken)

        if (
            !decodedToken.exp ||
            decodedToken.exp * 1000 < new Date().getTime()
        ) {
            localStorage.removeItem('user')
            location.reload()
        }

        config.headers!.authorization = `Bearer ${jwtToken}`
    } catch (error) {
        localStorage.removeItem('user')
    }

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

export const signup = (data: {
    firstname: string
    lastname: string
    country: string
    address1: string
    password: string
    password2: string
    email: string
    phonenumber: string
}) => axiosInstance.post('/users/register', data)

export const getActionHistoryByUserId = (
    pageSize: number,
    pageIndex: number,
    search: string
) =>
    axiosInstance.get(
        `/action-history/get-by-user?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
    )

export const getAllActionHistory = (pageSize: number, pageIndex: number) =>
    axiosInstance.get(
        `/action-history/get-by-user?pageSize=${pageSize}&pageIndex=${pageIndex}`
    )
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

export const getAllDepartments = () => axiosInstance.get('/department/getAll')

export const createNewService = (data: ICreateNewService) =>
    axiosInstance.post(`/services/create-new-service`, data)

export const getProductDetailForConfig = (id: string) =>
    axiosInstance.get(`/products/product-detail-for-config/${id}`)

export const getProductDetail = (id: string) =>
    axiosInstance.get(`/products/product-detail/${id}`)

export const shutDownCloud = (id: number, service_id: number) =>
    axiosInstance.post(`/listVMS/shutdown/${service_id}/${id}`)

export const resetCloud = (id: number, service_id: number) =>
    axiosInstance.post(`/listVMS/reset/${service_id}/${id}`)

export const startCloud = (id: number, service_id: number) =>
    axiosInstance.post(`/listVMS/start/${service_id}/${id}`)

export const stopCloud = (id: number, service_id: number) =>
    axiosInstance.post(`/listVMS/stop/${service_id}/${id}`)

export const rebootCloud = (id: number, service_id: number) =>
    axiosInstance.post(`/listVMS/reboot/${service_id}/${id}`)

export const getNotificationByUser = (type: string) =>
    axiosInstance.get(`/notification/get-by-user?type=${type}`)

export const getAllNotification = (
    pageIndex: number,
    filter: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/notification/getPaging?pageIndex=${pageIndex}&search=${filter}&pageSize=${pageSize}`
    )

export const createNotification = (data: INewNotification) =>
    axiosInstance.post(`/notification`, data)

export const getNotificationBySlug = (slug: string) =>
    axiosInstance.get(`/notification/get-by-slug?slug=${slug}`)

export const getAllUser = () => axiosInstance.get(`/users/get-all`)

export const getCloudVpsByUserIdVietTell = (
    search: string,
    pageIndex: number,
    pageSize: number
) =>
    axiosInstance.get(
        `/listVMS/getpaging?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    )

export const getVMDetail = (id: string, service_id: string) =>
    axiosInstance.get(`/listVMS/${service_id}/${id}`)

export const getServiceDetailForPayment = (id: string) =>
    axiosInstance.get(`/services/service-detail-for-payment/${id}`)

export const getAllInvoices = () => axiosInstance.get(`/invoices/all-invoices`)

export const getAllInvoicesByClientId = () =>
    axiosInstance.get(`/invoices/invoices-by-client-id`)

export const getInvoiceById = (id: string) =>
    axiosInstance.get(`/invoices/invoice-by-id/${id}`)

export const getInvoiceForDetail = (id: string) =>
    axiosInstance.get(`/invoices/invoice-for-detail/${id}`)

//thống kê người dùng
export const getUserStatistic = (
    pageIndex: number,
    userName: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/users/getpagingUser?pageIndex=${pageIndex}&search=${userName}&pageSize=${pageSize}`
    )
export const getOrderPagesToShow = () =>
    axiosInstance.get(`/order-pages/get-order-pages-to-show`)

export const getSubOrderPagesByParent = (slug: string) =>
    axiosInstance.get(`/order-pages/get-sub-order-pages-by-parent/${slug}`)

export const getProductsBySubOrderPage = (id: string) =>
    axiosInstance.get(`/products/products-by-sub-order-page/${id}`)

export const getPagingServices = (
    search: string,
    pageIndex: number,
    pageSize: number
) =>
    axiosInstance.get(
        `/services/get-paging?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    )

export const getServiceDetailsByServices = (serviceIds: any[]) =>
    axiosInstance.post(`/services/service-details-by-service`, {
        serviceIds,
    })

//action history
export const getOperationHistory = (
    pageSize: number,
    pageIndex: number,
    filter: string
) =>
    axiosInstance.get(
        `/action-history?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${filter}`
    )

export const getPagingUser = (
    pageSize: number,
    pageIndex: number,
    username: string
) =>
    axiosInstance.get(
        `/users/getpaging?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${username}`
    )

//danh sach dich vu
export const getService = (
    pageIndex: number,
    serverDefault?: string,
    serviceName?: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/products/getPaging?pageIndex=${pageIndex}&serverDefault=${serverDefault}&search=${serviceName}&pageSize=${pageSize}`
    )

export const addUserCredit = (id: string, credit: number) => axiosInstance.post(`/users/${id}/addCredit`, { credit })
