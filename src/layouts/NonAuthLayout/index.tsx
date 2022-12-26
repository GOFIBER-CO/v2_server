import { Outlet } from 'react-router'
import '@/styles/layout/NonAuthLayout/NonAuthLayout.scss'

const NonAuthLayout: React.FC = () => {
    return (
        <div className="non-auth-layout">
            <Outlet />
        </div>
    )
}

export default NonAuthLayout
