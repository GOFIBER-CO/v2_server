const ConverMoney = (money: number | undefined) => {
    return money ? money.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'): ''
}

export default ConverMoney
