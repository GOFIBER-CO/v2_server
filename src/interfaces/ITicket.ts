export default interface ITicket {
    _id: string
    code: string
    supportName: string
    level: number
    processingRoom: {
        processingRoomName: string
    }
    title: string
    content: string
    file: string
    user: {
        _id: string
        email: string
    }
    status: number
    createdTime: string
    feedBack: string
    modifiedBy: {
        email: string
    }
    updatedTime: string
}
