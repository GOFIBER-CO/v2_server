import { useState } from 'react'
import AppRouter from './routers'
import './App.css'
import 'draft-js/dist/Draft.css'
import { AuthProvider } from './hooks/useAuth'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { LayoutProvider } from './hooks/useInitLayOut'
import '../node_modules/font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <div className="App">
            <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
            <LayoutProvider child={<AuthProvider child={<AppRouter />} />} />
        </div>
    )
}

export default App

export enum notifyType {
    NOTIFY_SUCCESS = 'success',
    NOTIFY_ERROR = 'error',
}

export const notify = (type: string, message: string) => {
    switch (type) {
        case notifyType.NOTIFY_SUCCESS:
            toast.success(message)
            break
        case notifyType.NOTIFY_ERROR:
            toast.error(message)
        default:
            break
    }
}
