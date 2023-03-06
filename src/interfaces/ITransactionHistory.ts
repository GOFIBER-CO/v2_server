import ICloudServer from './ICloudServer'
import {IUser} from './IUser'

export default interface ITransactionHistory {
    code?: string
    transactionHistoryName?: string
    content?: string
    balanceBeforeTransaction?: number
    price?: number
    balanceAfterTransaction?: number
    status?: number
    user?: IUser
    createdTime?: string
    updatedTime?: string
    cloudServer?: ICloudServer
}
