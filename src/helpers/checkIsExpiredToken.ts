import jwt_decode from 'jwt-decode'

const checkIsExpiredToken = (token: string): boolean => {
    try {
        const decodedToken = jwt_decode<{ exp: number; iat: number }>(token)
        if (!decodedToken.exp || Date.now() > decodedToken.exp * 1000) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}

export default checkIsExpiredToken
