import { notify, notifyType } from '@/App'
import appConfig from '@/config/appConfig'
import io from 'socket.io-client'

export const socket = io(appConfig.API_URL,{
    auth: {
        token: JSON.parse(localStorage.getItem('user') || 'null')?.jwtToken || ''
    }
})





