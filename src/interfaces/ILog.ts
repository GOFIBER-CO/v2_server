import {IUser} from './IUser'

export default interface ILog {
    code?: string
    logName?: string
    user?: IUser
    status?: number
    completionTime?: string
    createdTime?: string
    updatedTime?: string
}
