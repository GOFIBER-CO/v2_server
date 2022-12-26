import jwt_decode from 'jwt-decode'

interface IJwtDecode {
    exp: number
    userId: string
    role: string
}

export default function authentication(): boolean {
    const token = localStorage.getItem('user')
    if (!token) return false
    const decodedToken: IJwtDecode = jwt_decode(token)
    if (decodedToken.exp) {
        if (decodedToken.exp < new Date().getTime()) {
            return false
        } else {
            return true
        }
    }
    return false
}
