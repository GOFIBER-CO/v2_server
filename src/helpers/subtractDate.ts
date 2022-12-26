export default function subtractDate(date1: Date, date2: Date) {
    return Math.ceil(
        Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
    )
}
