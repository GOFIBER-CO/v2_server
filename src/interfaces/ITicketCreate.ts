export default interface ITicketCreate {
    level: number
    processingRoom: string
    title?: string
    content?: string
    file: File | null
    user: string
}
