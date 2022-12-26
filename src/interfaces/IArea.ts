export default interface IArea {
    _id?: string
    code: string
    areaName: string
    country: string
    status: number
    createdTime?: string
    file: string | File
    img?: string
    isCheck?: boolean
}
