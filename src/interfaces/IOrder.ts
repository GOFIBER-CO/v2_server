import ICloudServer from './ICloudServer'
import IUser from './IUser'

export default interface IOrder {
    code: string
    user: IUser
    totalPrice: Number
    productId: ICloudServer
    createdAt: string
}
