export const convertDescriptionProductToObject = (str: string) => {
    const obj: any = {}

    str.split('<br>').forEach((item, index) => {
        if (index < str.split('<br>').length - 1) {
            const [key, value] = item.split(':')
            obj[key] = value
        }
    })
    return obj
}

export enum CYCLE_TIME {
    MONTHLY = 'm',
    QUARTERLY = 'q',
    SEMI_ANNUALLY = 's',
    ANNUALLY = 'a',
}

export enum RESPONSE_STATUS {
    SUCCESS = 1,
    FAILED = 0,
    REDIRECT = 2,
}

export function timeCalculator(seconds: number) {
    let y = Math.floor(seconds / 31536000)
    let mo = Math.floor((seconds % 31536000) / 2628000)
    let d = Math.floor(((seconds % 31536000) % 2628000) / 86400)
    let h = Math.floor((seconds % (3600 * 24)) / 3600)
    let m = Math.floor((seconds % 3600) / 60)
    let s = Math.floor(seconds % 60)

    let yDisplay = y > 0 ? y + ' năm, ' : ''
    let moDisplay = mo > 0 ? mo + ' tháng, ' : ''
    let dDisplay = d > 0 ? d + ' ngày, ' : ''
    let hDisplay = h + ' giờ, '
    let mDisplay = m + ' phút, '
    let sDisplay = s + ' giây '
    return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay
}

export const convertByteToMB = (value: number) => {
    const mbValue = (value / 1000000).toFixed(2)

    return mbValue + ' MB'
}

export function convertMBtoGB(mb: number) {
    return parseFloat((mb / 1024).toFixed(2))
}
