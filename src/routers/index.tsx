import MainLayout from '@/layouts/MainLayout'
import Auth from '@/pages/Auth'
import Home from '@/pages/Home'
import { Navigate, Route, Routes } from 'react-router'
import NonAuthLayout from '@/layouts/NonAuthLayout'
import ErrorPage from '@/pages/Error'
import ActionHistory from '@/pages/ActionHistory'
import Support from '@/pages/Support'
import DepositGuide from '@/pages/DepositGuide'
import DepositCheck from '@/pages/DepositCheck'
import Transaction from '@/pages/TransactionHistory/Transaction'
import CloudVps from '@/pages/CloudVps'
import CreateTicket from '@/pages/Support/CreateTicket'
import CreateCloud from '@/pages/CloudVps/CreateCloud'
import { useAuth } from '@/hooks/useAuth'
import Register from '@/pages/Register'
import OperatingSystem from '@/pages/OperatingSystem'
import CreateOperatingSystem from '@/pages/OperatingSystem/CreateOperatingSystem'
import Service from '@/pages/Services'
import CreateService from '@/pages/Services/CreateService'
import Location from '@/pages/Location'
import CreateLocation from '@/pages/Location/CreateLocation'
import ManageTicket from '@/pages/ManageTicket'
import Notification from '@/pages/Notification'
import EditOperatingSystem from '@/pages/OperatingSystem/EditOperatingSystem'
import EditLocation from '@/pages/Location/EditLocation'
import EditService from '@/pages/Services/EditService'
import ManageDepositGuide from '@/pages/ManageDepositGuide'
import Profile from '@/pages/Profile'
import Department from '@/pages/Department'
import CreateDepartment from '@/pages/Department/CreateDepartment'
import EditDepartment from '@/pages/Department/CreateDepartment/editDepartment'
import DeleteDepartment from '@/pages/Department/CreateDepartment/deleteDeparment'
import FASecurity from '@/pages/2FASecurity'
import ChangePassword from '@/pages/ChangePassword'
import TwoFactor from '@/pages/Auth/TwoFactor'
import NotificationDetail from '@/pages/Notification/NotificationDetail'
import CreateNotification from '@/pages/Notification/CreateNotification'
import ManageOrder from '@/pages/ManageOrder'
import EditOrder from '@/pages/ManageOrder/EditOrder'
import EditTicket from '@/pages/ManageTicket/EditTicket'
import UserStatistic from '@/pages/UserStatistic'
import checkIsExpiredToken from '@/helpers/checkIsExpiredToken'
import DeletedCloud from '@/pages/CloudVps/DeletedCloud'
import AboutToExpire from '@/pages/CloudVps/AboutToExpire'
import LoginNew from './../pages/LoginNew/index'
import RegisterNew from '@/pages/RegisterNew'
import UpdateCloud from '@/pages/CloudVps/UpdateCloud'
import OperationHistory from '@/pages/OperationHistory'
import ManagePrice from '@/pages/ManagePrice'
import ManageIp from '@/pages/ManageIP'
import CreateIp from '@/pages/ManageIP/CreateIp'
const AppRouter: React.FC = () => {
    const auth = useAuth()
    const isLoggedIn = auth.isLoggedIn
    const isEnable2Fa = auth.isEnable2FaAuthenticate
    const isVerified = auth.isVerified
    return (
        <>
            <Routes>
                {(isVerified && !checkIsExpiredToken(auth.jwtToken)) ||
                (!isEnable2Fa &&
                    isLoggedIn &&
                    !checkIsExpiredToken(auth.jwtToken)) ? (
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path = "/manage-ip" element={<ManageIp />} />
                        <Route path = "/manage-ip/create" element={<CreateIp />} />
                        <Route path="/cloud-vps" element={<CloudVps />} />
                        <Route path='/manage-price' element={<ManagePrice/>}/>
                        <Route
                            path="/action-history"
                            element={<ActionHistory />}
                        />
                        <Route path="/support" element={<Support />} />
                        <Route
                            path="/deposit-guide"
                            element={<DepositGuide />}
                        />
                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />
                        <Route
                            path="/deposit-check"
                            element={<DepositCheck />}
                        />
                        <Route path="/transaction" element={<Transaction />} />
                        <Route
                            path="/cloud-vps/create-cloud"
                            element={<CreateCloud />}
                        />
                        <Route
                            path="/cloud-vps/update-cloud/:id"
                            element={<UpdateCloud />}
                        />
                        <Route
                            path="/cloud-vps/deleted-cloud"
                            element={<DeletedCloud />}
                        />
                        <Route
                            path="/cloud-vps/about-to-expired"
                            element={<AboutToExpire />}
                        />
                        <Route
                            path="/support/create-ticket"
                            element={<CreateTicket />}
                        />
                        <Route
                            path="/notification/:slug"
                            element={<NotificationDetail />}
                        />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/2fa-security" element={<FASecurity />} />
                        {!auth.user.isCustomer && (
                            <>
                                <Route
                                    path="/operating-system"
                                    element={<OperatingSystem />}
                                />
                                <Route
                                    path="/operating-system/create-operating-system"
                                    element={<CreateOperatingSystem />}
                                />
                                <Route
                                    path="/operating-system/:id"
                                    element={<EditOperatingSystem />}
                                />
                                <Route path="/service" element={<Service />} />
                                <Route
                                    path="/service/:id"
                                    element={<EditService />}
                                />
                                <Route
                                    path="/service/create-service"
                                    element={<CreateService />}
                                />
                                <Route
                                    path="/location"
                                    element={<Location />}
                                />
                                <Route
                                    path="/location/create-location"
                                    element={<CreateLocation />}
                                />
                                <Route
                                    path="/location/:id"
                                    element={<EditLocation />}
                                />
                                <Route
                                    path="/manage-ticket"
                                    element={<ManageTicket />}
                                />
                                <Route
                                    path="/notification"
                                    element={<Notification />}
                                />
                                <Route
                                    path="/notification/create-notification"
                                    element={<CreateNotification />}
                                />
                                <Route
                                    path="/manage-deposit-guide"
                                    element={<ManageDepositGuide />}
                                />
                                <Route
                                    path="/department"
                                    element={<Department />}
                                />
                                <Route
                                    path="/department/create-department"
                                    element={<CreateDepartment />}
                                />
                                <Route
                                    path="/department/edit-department/:id"
                                    element={<EditDepartment />}
                                />
                                <Route
                                    path="/department/delete-department/:id"
                                    element={<DeleteDepartment />}
                                />
                                <Route
                                    path="/manage-order"
                                    element={<ManageOrder />}
                                />
                                <Route
                                    path="/manage-order/:id"
                                    element={<EditOrder />}
                                />
                                <Route
                                    path="/manage-ticket/:id"
                                    element={<EditTicket />}
                                />
                                <Route
                                    path="/user-statistic"
                                    element={<UserStatistic />}
                                />
                                <Route
                                    path="/operation-history"
                                    element={<OperationHistory />}
                                />
                            </>
                        )}
                    </Route>
                ) : (
                    <Route path="/" element={<NonAuthLayout />}>
                        <Route index element={<LoginNew />} />
                        <Route path="/register" element={<RegisterNew />} />
                        {/* <Route index element={<Auth />} /> */}
                        {/* <Route path="/register" element={<Register />} /> */}
                        {auth.isEnable2FaAuthenticate && auth.isLoggedIn && (
                            <Route path="/verify-2fa" element={<TwoFactor />} />
                        )}
                    </Route>
                )}
                <Route path="/*" element={<Navigate to={'/'} />} />
            </Routes>
        </>
    )
}

export default AppRouter
