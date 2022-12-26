export const expiryDateType = (type: number):string => {
    switch(type){
        case 1: 
            return 'Giờ'
        case 2: 
            return 'Ngày'
        case 3: 
            return 'Tháng'
        case 4: 
            return '3 Tháng'
        case 5: 
            return '6 Tháng'
        case 6: 
            return 'Năm'
        default: 
            return ''
    }
}