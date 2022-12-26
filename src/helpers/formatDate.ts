import moment from 'moment'

const formatDate = (date: string) => {
    return moment(date).format('DD/MM/YYYY hh:mm:ss')
}

export default formatDate
