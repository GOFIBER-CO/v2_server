export default interface INewNotification {
    sender: string
    code: string
    status: boolean
    name: string
    slug: string
    type: string
    reciever: string[]
    content: string
}
