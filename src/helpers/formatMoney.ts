export default (money: number | string) => {
    return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}
