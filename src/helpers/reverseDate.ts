const reverseDate = (date: string): string => {
    const dateArray = date.split('/')
    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
}

export default reverseDate
