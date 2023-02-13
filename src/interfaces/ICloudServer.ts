import IArea from './IArea'
import Ip from './IIps'
import IOperatingSystem from './IOperatingSystem'
import IOrder from './IOrder'
import IService from './IService'

export default interface ICloudServer {
    _id: string
    code: string
    cloudServerName: string
    password: string
    port: number
    user: string
    area: IArea
    operatingSystem: IOperatingSystem
    server: IService
    isShow: boolean
    createdTime: Date
    order: IOrder
    isAutoRenew: boolean,
    status: string,
    ip: Ip,
}
