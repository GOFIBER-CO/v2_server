import {IUser} from './IUser'

export default interface INotification {
    _id?: string
    code?: string
    name: string
    slug: string
    type: string
    reciever: IUser[] | string[]
    content: string
    sender: { email: string; _id: string } | string
    status: boolean,
    createdAt: Date,
    updatedAt: Date,
    readBy: string[]
}
