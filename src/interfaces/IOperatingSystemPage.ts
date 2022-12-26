import IOperatingSystem from './IOperatingSystem'

export default interface IOparatingSystemArray {
    _id?: string
    parent: IOperatingSystem
    children: IOperatingSystem[]
    operatingSystemName: string
    parentID?: string
    createdTime?: string
    file: File | string | undefined
    img?: string
    isCheck?: boolean
    isShow?: boolean
    version?: String
}
