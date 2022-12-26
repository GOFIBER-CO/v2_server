export default interface IOperatingSystem {
    _id?: string
    code: string
    operatingSystemName: string
    parentID?: string
    createdTime?: string
    file: File | string | null
    img?: string
    children: IOperatingSystem[]
    isCheck?: boolean
    isShow?: boolean
    version?: String
}
