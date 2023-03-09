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

export const skeletonList = new Array(10).fill('').map((e, idx) => {
    return {
        key: idx,
    }
})

export function subtractDate(date1: Date, date2: Date) {
    return Math.ceil(
        Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
    )
}

export function subtractNow(date: string) {
    const temp = Math.ceil(
        Math.abs(new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    return temp / 30 >= 1
        ? `${Math.ceil(temp / 30)} tháng tới`
        : `${temp} ngày tới`
}

const data = [
    {
        id: 1,
        type: 'dummy',
        ip: '116.103.108.153',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: 'x0tUc1PW',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 2,
        type: 'dummy',
        ip: '116.103.108.154',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: 'x0tUc1PW',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 3,
        type: 'dummy',
        ip: '116.103.108.162',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '4qz6L080',
        note: 'TDùng cho tool content TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 4,
        type: 'dummy',
        ip: '116.103.108.148',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'Gofibee@123@xyz',
        note: 'Tạo cho stoner TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 5,
        type: 'dummy',
        ip: '116.103.108.149',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'Gofibee@123@xyz',
        note: 'Tạo cho stoner TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 6,
        type: 'dummy',
        ip: '116.103.108.150',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'Gofibee@123@xyz',
        note: 'Tạo cho stoner TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 7,
        type: 'dummy',
        ip: '116.103.108.155',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'Gofibee@123@xyz',
        note: 'Tạo cho stoner TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 8,
        type: 'dummy',
        ip: '116.103.108.156',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'Gofibee@123@xyz',
        note: 'Tạo cho a LindaTP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 9,
        type: 'dummy',
        ip: '116.103.108.158',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: 'R9RuGwOX',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 10,
        type: 'dummy',
        ip: '116.103.108.159',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: 'ucPDGr8E',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 11,
        type: 'dummy',
        ip: '116.103.108.145',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: 'ko biết của ai - bị xoá ',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 12,
        type: 'dummy',
        ip: '116.103.108.164',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: 'ko biết của ai',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 13,
        type: 'dummy',
        ip: '116.103.108.220',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'x0tUc1PW',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 14,
        type: 'dummy',
        ip: '116.103.108.225',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Windows Server 2019',
        pass: 'x0tUc1PW',
        note: 'Tạo cho a Linda TP',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 15,
        type: 'dummy',
        ip: '116.103.108.129',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 16,
        type: 'dummy',
        ip: '116.103.108.130',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 17,
        type: 'dummy',
        ip: '116.103.108.131',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 18,
        type: 'dummy',
        ip: '116.103.108.132',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 19,
        type: 'dummy',
        ip: '116.103.108.133',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 20,
        type: 'dummy',
        ip: '116.103.108.134',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 21,
        type: 'dummy',
        ip: '116.103.108.135',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 22,
        type: 'dummy',
        ip: '116.103.108.136',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 23,
        type: 'dummy',
        ip: '116.103.108.137',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 24,
        type: 'dummy',
        ip: '116.103.108.138',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 25,
        type: 'dummy',
        ip: '116.103.108.139',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 26,
        type: 'dummy',
        ip: '116.103.108.140',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 27,
        type: 'dummy',
        ip: '116.103.108.141',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 28,
        type: 'dummy',
        ip: '116.103.108.142',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
    {
        id: 29,
        type: 'dummy',
        ip: '116.103.108.143',
        cpu: 16,
        ram: 32,
        ssd: 300,
        os: 'Centos 7',
        pass: '',
        note: '',
        price: 3800000,
        status: 'Unpaid',
    },
]
