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
