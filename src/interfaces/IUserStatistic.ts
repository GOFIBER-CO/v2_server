export default interface IUserStatistic {
    userId: string
    code: string
    userName: string
    numberOfCloudVps: number
    numberOfTicketSent: number
    numberOfTicketSolved: number
    priceUsed: {
        _id: null
        sum: number
    }
    numberOfPricePurchase: number
}
