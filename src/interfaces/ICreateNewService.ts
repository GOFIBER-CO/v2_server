export default interface ICreateNewService {
    product_id: string
    domain: string
    cycle: string
    pay_method: number
    os: string
    type: 'custom' | 'instance'
    backup?: string
    dataCustom?: string[]
}
