import { notify } from '@/App'
import saveToLocalStorage from '@/helpers/saveToLocalStorage'
import { getUserDetail, login } from '@/services/apiv2'
import { AxiosError } from 'axios'
import {
    createContext,
    ReactElement,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'
import { NavigateFunction } from 'react-router'
import jwtDecode from 'jwt-decode'
import {IUser} from '@/interfaces/IUser'

interface IInitStateProvider {
    jwtToken: string
    isLoggedIn: boolean
    buttonLoading?: boolean
    isEnable2FaAuthenticate: boolean
    isVerified: boolean
    user: IUser | null
}

interface IInitContext {
    jwtToken: string
    isLoggedIn: boolean
    isEnable2FaAuthenticate: boolean
    isVerified: boolean
    user: IUser | null
    buttonLoading?: boolean
    loginSync: (
        username: string,
        password: string,
        navigate: NavigateFunction
    ) => void
    logout: (navigate: NavigateFunction) => void
    setEnable2Fa: (status: boolean) => void
    // authenticate2FA: (token: string, navigate: NavigateFunction) => void
}

const initContext: IInitContext = {
    jwtToken: '',
    buttonLoading: false,
    isLoggedIn: false,
    isEnable2FaAuthenticate: false,
    isVerified: false,
    user: null,
    async loginSync(
        username: string,
        password: string,
        navigate: NavigateFunction
    ) {},
    logout(navigate: NavigateFunction) {},
    setEnable2Fa: (status: boolean) => {},
    // authenticate2FA: (token: string, navigate: NavigateFunction) => {},
}

const authContext = createContext(initContext)

export const useAuth = () => useContext(authContext)

export const AuthProvider = ({ child }: { child: ReactNode }): ReactElement => {
    const auth = useProvideAuth()

    return <authContext.Provider value={auth}>{child}</authContext.Provider>
}

const useProvideAuth = () => {
    const [auth, setAuth] = useState<IInitStateProvider>({
        jwtToken: '',
        isLoggedIn: JSON.parse(localStorage.getItem('user') || 'null')
            ?.isLoggedIn,
        buttonLoading: false,
        ...JSON.parse(localStorage.getItem('user') || 'null'),
    })

    const loginSync = async (  
        username: string,
        password: string,
        navigate: NavigateFunction
    ) => {
        try {
            setAuth({ ...auth, buttonLoading: true })
            const user = await login(username, password)
            if (user.data.data && user.data?.data.user) {
                saveToLocalStorage<IInitStateProvider>('user', {
                    jwtToken: user.data.data.accessToken,
                    user: null,
                    isLoggedIn: true,
                    isEnable2FaAuthenticate:
                        user.data.data.user.isEnable2FaAuthenticate,
                    isVerified: false,
                })
                if (user.data.status == 1) {
                    setAuth({
                        ...auth,
                        jwtToken: user.data.data.token,
                        user: user.data.data.user,
                        isLoggedIn: true,
                        isEnable2FaAuthenticate:
                            user.data.data.user.isEnable2FaAuthenticate,
                        isVerified: false,
                        buttonLoading: false,
                    })
                    if (user.data.data.user.isEnable2FaAuthenticate) {
                        navigate('/verify-2fa')
                    } else {
                        notify('success', user.data.message)
                    }
                } else {
                    notify('error', user.data.message)
                    setAuth({ ...auth, buttonLoading: false })
                }
            } else {
                notify('error', user.data.message)
                setAuth({ ...auth, buttonLoading: false })
            }
        } catch (error: AxiosError | any) {
            setAuth({ ...auth, buttonLoading: false })
            console.log(error)
            notify('error', error.response.data)
        }
    }

    // const authenticate2FA = async (
    //     token: string,
    //     navigate: NavigateFunction
    // ) => {
    //     try {
    //         setAuth({ ...auth, buttonLoading: true })
    //         const user = await ;l(auth.user._id, token)
    //         if (user.data.status == 1) {
    //             saveToLocalStorage<IInitStateProvider>('user', {
    //                 jwtToken: user.data.data.token,
    //                 user: user.data.data.user,
    //                 isLoggedIn: true,
    //                 isEnable2FaAuthenticate:
    //                     user.data.data.user.isEnable2FaAuthenticate,
    //                 isVerified: true,
    //             })
    //             setAuth({
    //                 ...auth,
    //                 jwtToken: user.data.data.token,
    //                 user: user.data.data.user,
    //                 isLoggedIn: true,
    //                 isEnable2FaAuthenticate: true,
    //                 isVerified: true,
    //                 buttonLoading: false,
    //             })
    //             notify('success', user.data.message)
    //             navigate('/')
    //         } else {
    //             notify('error', user.data.message)
    //             setAuth({ ...auth, buttonLoading: false })
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         setAuth({ ...auth, buttonLoading: false })
    //         notify('error', error.response.data.message)
    //     }
    // }

    const setEnable2Fa = (status: boolean) => {
        const user = JSON.parse(localStorage.getItem('user') || '')
        if (user) {
            saveToLocalStorage<IInitStateProvider>('user', {
                jwtToken: user.jwtToken,
                user: user.user,
                isLoggedIn: user.isLoggedIn,
                isEnable2FaAuthenticate: status,
                isVerified: status,
            })
        }
        setAuth({
            ...auth,
            isEnable2FaAuthenticate: status,
            isVerified: status,
        })
    }

    const logout = (navigate: NavigateFunction) => {
        localStorage.removeItem('user')
        setAuth({
            jwtToken: '',
            buttonLoading: false,
            isLoggedIn: false,
            isEnable2FaAuthenticate: false,
            isVerified: false,
            user:null,
        })
        notify('success', 'Đăng xuất thành công')
        navigate('/')
    }

    const getUser = async () => {
        try {
            const user = await getUserDetail()
            setAuth({...auth, user: user.data.data})
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getUser()
    },[])

    return {
        ...auth,
        loginSync,
        logout,
        setEnable2Fa,
    }
}
