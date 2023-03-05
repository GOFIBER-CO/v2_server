import IDepartment from '@/interfaces/IDepartment'
import IInserCloudServer from '@/interfaces/IInserCloudServer'
import INewNotification from '@/interfaces/INewNotification'
import IPrice from '@/interfaces/IPrice'
import IService from '@/interfaces/IService'
import IUpdateCloudServer from '@/interfaces/IUpdateCloudServer'
import {IUser} from '@/interfaces/IUser'
import axios from 'axios'

// const baseUrl = ''
// const baseUrl = 'http://localhost:8079'
const baseUrl = 'http://localhost:4000/api/v1'

let axiosInstance = axios.create({
    baseURL: baseUrl,
})


export const login = (username: string, password: string) =>
    axiosInstance.post('/api/user/login', {
        userName: username,
        password: password,
    })

export const signup = (data: {
    firstname: string,
    lastname: string,
    country: string,
    address1: string,
    password: string
    email: string
    phoneNumber: string
}) => axiosInstance.post('/api/user/register', data)

export const getUserById = (id: string) =>
    axiosInstance.post(`/api/user/getById`, {
        userId: id,
    })

export const verify2FaToken = (id: string, token: string) =>
    axiosInstance.post('/api/user/verify2FaToken', {
        id: id,
        token: token,
    })

export const login2Fa = (id: string, token: string) =>
    axiosInstance.post('/api/user/login2Fa', {
        id: id,
        token: token,
    })

export const getUserSurplus = (id: string) =>
    axiosInstance.get(`/api/user/surplus/${id}`)

export const changePassword = (
    id: string,
    password: string,
    newPassword: string
) =>
    axiosInstance.post(`/api/user/changePassword`, {
        userId: id,
        password: password,
        newPassword: newPassword,
    })

export const getUserQrCode = (id: string) =>
    axiosInstance.get(`/api/user/getQrCode/${id}`)

export const disabled2fa = (id: string, password: string) =>
    axiosInstance.patch(`/api/user/disabled2fa/${id}`, {
        password: password,
    })

export const updateProfile = (id: string, data: IUser) =>
    axiosInstance.put(`/api/user/update/${id}`, data)

export const getAllUser = () => axiosInstance.get('/api/user/getAllUser')

export const getCloudVps = () => axiosInstance.get('/api/cloudServer/getPaging')

export const switchAutoRenew = (id: string, status: boolean) =>
    axiosInstance.patch(`/api/cloudServer/switchIsAutoRenew/${id}`, {
        isAutoRenew: status,
    })

export const deleteCloudServer = (id: string) =>
    axiosInstance.delete(`/api/cloudServer/deleteCloudServer/${id}`)

export const getCloudVpsByUserId = (
    userId: string,
    areaId: string,
    operatingSystemId: string,
    search: string,
    pageIndex: number,
    pageSize: number
) =>
    axiosInstance.get(
        `/api/cloudServer/getCloudServerByUserId?userId=${userId}&areaId=${areaId}&operatingSystemId=${operatingSystemId}&search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    )

export const getCloudServerById = (id: string) =>
    axiosInstance.post(`/api/cloudServer/getById`, {
        cloudServerId: id,
    })

export const getAboutToExpireCloud = (
    userId: string,
    areaId: string,
    operatingSystemId: string,
    search: string,
    pageIndex: number,
    pageSize: number
) =>
    axiosInstance.get(
        `/api/cloudServer/aboutToExpire?userId=${userId}&areaId=${areaId}&operatingSystemId=${operatingSystemId}&search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    )

export const getDeletedCloudServer = (
    userId: string,
    areaId: string,
    operatingSystemId: string,
    search: string,
    pageIndex: number,
    pageSize: number
) =>
    axiosInstance.get(
        `/api/cloudServer/deletedCloud?userId=${userId}&areaId=${areaId}&operatingSystemId=${operatingSystemId}&search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    )

export const renewCloudServer = (
    id: string,
    totalPrice: number,
    time: number
) =>
    axiosInstance.post(`/api/cloudServer/renewCloudServer/${id}`, {
        totalPrice: totalPrice,
        time: time,
    })
export const getService = (
    pageIndex: number,
    serverDefault?: string,
    serviceName?: string,
    pageSize?: number,
    expiryDate?: number
) =>
    axiosInstance.get(
        `/api/server/getPaging?pageIndex=${pageIndex}&serverDefault=${serverDefault}&search=${serviceName}&expiryDate=${expiryDate}&pageSize=${pageSize}`
    )

export const createService = (data: IService) =>
    axiosInstance.post('/api/server/insert', data)

export const editService = (id: string, data: IService) =>
    axiosInstance.put(`/api/server/update/${id}`, data)

export const getServiceById = (id: string) =>
    axiosInstance.post(`/api/server/getById`, {
        serverId: id,
    })

export const deleteService = (id: string) =>
    axiosInstance.delete(`/api/server/delete/${id}`)

export const getAllLocation = (
    pageIndex: number,
    locationName?: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/area/getPaging?pageIndex=${pageIndex}&search=${locationName}&pageSize=${pageSize}`
    )

export const getLocations = () => axiosInstance.get(`/api/area/getAllLocations`)

export const createLocation = (data: FormData) =>
    axiosInstance.post('/api/area/insert', data)

export const getLocationById = (id: string) =>
    axiosInstance.post(`/api/area/getById`, {
        areaId: id,
    })

export const editLocation = (id: string, data: FormData) =>
    axiosInstance.put(`/api/area/update/${id}`, data)

export const deleteLocation = (id: string) =>
    axiosInstance.delete(`/api/area/delete/${id}`)

export const getOs = () =>
    axiosInstance.get('/api/operatingSystem/getOperatingSystem')

export const getAllOs = (
    pageIndex?: number,
    operatingSystemName?: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/operatingSystem/getPaging?pageIndex=${pageIndex}&search=${operatingSystemName}&pageSize=${pageSize}`
    )

export const createOs = (data: FormData) =>
    axiosInstance.post('/api/operatingSystem/insert', data)

export const getOperatingSystemById = (id: string) =>
    axiosInstance.post(`/api/operatingSystem/getById`, {
        operatingSystemId: id,
    })

export const editOs = (id: string, data: FormData) =>
    axiosInstance.put(`/api/operatingSystem/update/${id}`, data)

export const getTickets = (
    pageIndex: number,
    level?: number,
    email?: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/support/getPaging?pageIndex=${pageIndex}&level=${level}&search=${email}&pageSize=${pageSize}`
    )

export const getProcessingRoom = () =>
    axiosInstance.get('/api/processingRoom/getPaging')

export const createNewTicket = (data: FormData) =>
    axiosInstance.post('/api/support/insert', data)

export const deleteOs = (id: string) =>
    axiosInstance.delete(`/api/operatingSystem/delete/${id}`)

export const getSupportByUserId = (
    id: string,
    pageIndex: number,
    SupportTT: string,
    SupportUT: string,
    supportName: string,
    pageSize: number
) =>
    axiosInstance.get(
        `/api/support/getSupportByUserId?userId=${id}&pageIndex=${pageIndex}&supportTT=${SupportTT}&supportUT=${SupportUT}&supportName=${supportName}&pageSize=${pageSize}`
    )

export const updateSupport = (id: string, data: FormData) =>
    axiosInstance.put(`/api/support/update/${id}`, data)

export const getAllDepartment = (
    pageIndex: number,
    filter: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/processingRoom/getPaging?pageIndex=${pageIndex}&search=${filter}&pageSize=${pageSize}`
    )

export const createDepartment = (data: IDepartment) =>
    axiosInstance.post('/api/processingRoom/insert', data)

export const editDepartment = (id: string | undefined, data: IDepartment) =>
    axiosInstance.put(`/api/processingRoom/update/${id}`, data)

export const getByIdDepartment = (id: string) =>
    axiosInstance.get(`/api/processingRoom/getById/${id}`)

export const deleteDepartment = (id: string | undefined) =>
    axiosInstance.delete(`/api/processingRoom/delete/${id}`)

export const getNotificationByUserId = (id: string, type?: string) =>
    axiosInstance.get(`/api/notification/getByUserId?userId=${id}&type=${type}`)

export const getNotificationBySlug = (slug: string, userId: string) =>
    axiosInstance.get(
        `/api/notification/getBySlug?slug=${slug}&userId=${userId}`
    )

export const getAllNotification = (
    pageIndex: number,
    filter: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/notification/getPaging?pageIndex=${pageIndex}&search=${filter}&pageSize=${pageSize}`
    )

export const createNotification = (data: INewNotification) =>
    axiosInstance.post(`/api/notification/insert`, data)

export const getTicketById = (id: string) =>
    axiosInstance.post(`/api/support/getById`, { supportId: id })

export const updateTicket = (
    id: string,
    data: {
        feedBack: string
        status: number
        modifiedUser: string
        userId: string
    }
) => axiosInstance.put(`/api/support/update/${id}`, data)

export const getDepositGuide = () => axiosInstance.get('/api/deposit-guide')

export const updateDepositGuide = (id: string, content: string) =>
    axiosInstance.put(`/api/deposit-guide/update/${id}`, {
        content: content,
    })

export const getUserStatistic = (
    pageIndex: number,
    userName: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/statistic?pageIndex=${pageIndex}&search=${userName}&pageSize=${pageSize}`
    )

export const getOrders = (
    pageIndex: number,
    userName: string,
    timeFrom: string,
    timeTo: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/api/order?pageIndex=${pageIndex}&search=${userName}&timeFrom=${timeFrom}&timeTo=${timeTo}&pageSize=${pageSize}`
    )
export const getAllOrder = () => {
    axiosInstance.get(`/api/order/getAll`)
}
//api create cloud
export const getArea = () => axiosInstance.get('/api/area/getPaging')
export const getOperatingSystemChildren = () =>
    axiosInstance.get('/api/operatingSystem/getOperatingSystemChildren')
export const getServer = (expiryDateType: number) =>
    axiosInstance.get(
        `/api/server/getPaging?serverDefault=true&expiryDateType=${expiryDateType}`
    )
export const createCloud = (data?: IInserCloudServer) =>
    axiosInstance.post('/api/cloudServer/insert', data)
export const updateCloud = (data?: IUpdateCloudServer) =>
    axiosInstance.put(`/api/cloudServer/update/${data?._id}`, {
        cloudServerName: data?.cloudServerName,
    })
//CloudServer
export const getCloudServersById = (id: any) => {
    return axiosInstance.get(`/api/cloudServer/getById/${id}`)
}
export const updateDataOfServerInCloudServerById = (id: any, data: any) => {
    return axiosInstance.put(`api/cloudServer/server/update/${id}`, data)
}
//transactionHistory
export const getTransactionHistoryByCloudId = (
    userId?: string,
    cloudId?: string,
    pageIndex?: number
) =>
    axiosInstance.get(
        `/api/transactionHistory/getTransactionHistoryByCloudId?userId=${userId}&cloudId=${cloudId}&pageIndex=${pageIndex}`
    )
//log
export const getLogByUserId = (
    userId?: string,
    cloudServerId?: string,
    pageIndex?: number
) =>
    axiosInstance.get(
        `/api/log/getLogByUserId?userId=${userId}&cloudServerId=${cloudServerId}&pageIndex=${pageIndex}`
    )
//Snapshot
export const createSnapshot = (data: FormData) =>
    axiosInstance.post('/api/snapshot/insert', data)

export const getSnapshotsByUserId = (
    userId?: string,
    cloudServerId?: string,
    pageIndex?: number
) =>
    axiosInstance.get(
        `/api/snapshot/getSnapshotsByUserId?userId=${userId}&cloudServerId=${cloudServerId}&pageIndex=${pageIndex}`
    )

export const deleteSnapshot = (id: string) =>
    axiosInstance.delete(`/api/snapshot/delete/${id}`)
//
// export const updateLabelNameOfCloudVps = (cloudId?.string, cloudServerName?.string)=> {
//     axiosInstance.put(`/api/CloudVps/update/${cloudId}`, cloudServerName)
// }
export const updateCloudServerName = (id: any, data: any) =>
    axiosInstance.put(`/api/cloudServer/update/name/${id}`, {
        cloudServerName: data,
    })

//action history

export const getActionHistoryByUserId = (
    userId: string,
    pageSize: number,
    pageIndex: number
) =>
    axiosInstance.get(
        `/api/action-history/getByUserId/${userId}?pageSize=${pageSize}&pageIndex=${pageIndex}`
    )

export const getOperationHistory = (
    pageSize: number,
    pageIndex: number,
    filter: string
) =>
    axiosInstance.get(
        `/api/action-history/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&filter=${filter}`
    )

export const getIps = (pageSize: number, pageIndex: number, status: string) =>
    axiosInstance.get(
        `/api/ip/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}&status=${status}`
    )

export const createIp = (ip: string) =>
    axiosInstance.post(`/api/ip/create-ip`, { ip: ip })

export const editIp = (ip: string, id: string) =>
    axiosInstance.patch(`/api/ip/${ip}`, { id: id })

export const getIpById = (id: string) => axiosInstance.get(`/api/ip/${id}`)

export const updateIp = (id: string, ip: string) =>
    axiosInstance.patch(`/api/ip/${id}`, { ip: ip })

export const getPrice = () => axiosInstance.get(`/api/price`)

export const updatePrice = (id: string, data: IPrice) =>
    axiosInstance.put(`/api/price/${id}`, data)

// export const getPriceById = (id: string) => axiosInstance.get(`/api/price/${id}`)


export const getAllOs1 = (
    pageIndex?: number,
    operatingSystemName?: string,
    pageSize?: number
) =>
    axiosInstance.get(
        `/serviceTemplate/getPaging?pageIndex=${pageIndex}&search=${operatingSystemName}&pageSize=${pageSize}`
    )
export const getPriceById = (id: string) =>
    axiosInstance.get(`/api/price/${id}`)

const preUrl = '/api/v1'

let axiosInstanceNew = axios.create({
    baseURL: 'http://localhost:4000',
})
// order-pages
export const getOrderPagesToShow = () =>
    axiosInstanceNew.get(`${preUrl}/order-pages/get-order-pages-to-show`)

export const getSubOrderPagesByParent = (slug: string) =>
    axiosInstanceNew.get(
        `${preUrl}/order-pages/get-sub-order-pages-by-parent/${slug}`
    )

export const getProductsBySubOrderPage = (id: string) =>
    axiosInstanceNew.get(`${preUrl}/products/products-by-sub-order-page/${id}`)


   

    export const getOrdersViettell = (
        // pageIndex: number,
        // userName: string,
        // pageSize?: number
    ) =>
    axiosInstanceNew.get(
            `${preUrl}/client-order/getpaging`
        )

        // ?pageIndex=${pageIndex}&search=${userName}&pageSize=${pageSize}