import ICloudServer from './ICloudServer'

export default interface IMenuCloud {
    optionId: number
    name: string
    isCloud: boolean
    cloudId: string
    cloudItem?: ICloudServer
    url: string
}
