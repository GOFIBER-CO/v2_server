import '@/styles/layout/MainLayout/MainLayout.scss'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Divider, Layout, Menu, MenuProps } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import Avatar from 'antd/lib/avatar/avatar'
import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import {
    AiOutlinePlus,
    AiFillBell,
    AiOutlineAppstore,
    AiOutlineShoppingCart,
    AiOutlineAppstoreAdd,
    AiOutlineNotification,
} from 'react-icons/ai'
import { FiSearch, FiFacebook, FiShoppingCart } from 'react-icons/fi'
import { MdOutlineSecurity } from 'react-icons/md'
import { ImProfile } from 'react-icons/im'
import { FaTimes, FaMoneyBillAlt, FaHistory } from 'react-icons/fa'
import { RiMoneyPoundBoxLine, RiTicketLine } from 'react-icons/ri'
import { TbFileInvoice } from 'react-icons/tb'
import { BiBuildingHouse, BiHomeAlt, BiUser } from 'react-icons/bi'
import {
    MdOutlineComputer,
    MdOutlineSupportAgent,
    MdOutlineHistory,
    MdOutlineAddLink,
    MdOutlineSettingsSystemDaydream,
    MdHomeRepairService,
    MdManageAccounts,
} from 'react-icons/md'
import { CgList } from 'react-icons/cg'
import {
    BsMenuButtonWide,
    BsHeadphones,
    BsCheckLg,
    BsCardChecklist,
} from 'react-icons/bs'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { TbTicket } from 'react-icons/tb'
import BlurGlass from '@/components/BlugGlass/BlurGlass'
import { useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import Loading from '@/components/Loading/Loading'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { SlLocationPin } from 'react-icons/sl'
import ModalConfirm from '@/components/Modal'
import { getNotificationByUser } from '@/services/apiv2'
import { getUserSurplus } from '@/services/apiv2'
import INotification from '@/interfaces/INotification'
import { notify, notifyType } from '@/App'
import { isMobile } from 'react-device-detect'
import { IoStatsChart } from 'react-icons/io5'
import formatMoney from '@/helpers/formatMoney'
import { socket, SocketContext } from '@/socket/index'
import { HiOutlineDesktopComputer } from 'react-icons/hi'
import { useAppDispatch } from '@/redux'
import { getAllServices } from '@/redux/slices/serviceSlice'
import appConfig from '@/config/appConfig'

const { Header, Sider, Content } = Layout

const MainLayout: React.FC = () => {
    const [notifications, setNotifications] = useState<INotification[]>([])
    const location = useLocation()
    const [surplus, setSurplus] = useState('')
    const [collapsed, setCollapsed] = useState(false)
    const [userOption, setUserOption] = useState(false)
    const [panel, setPanel] = useState(false)
    const [notificationBox, setNotificationBox] = useState(false)
    const [notificationType, setNotificationType] = useState('')
    const auth = useAuth()
    const layoutInit = useLayoutInit()
    const dispatch = useAppDispatch()

    const [openKeys, setOpenKeys] = useState<string[]>([])
    const rootSubmenuKeys: string[] = ['/admin', '/information', '/manage']

    const navigate = useNavigate()

    const refUserOption = useRef(null)
    const refNotificationBox = useRef(null)
    const refPanel = useRef(null)

    useEffect(() => {
        const initServices = async () => {
            try {
                await dispatch(getAllServices({}))
            } catch (error) {
                console.log(error)
            }
        }
        initServices()
    }, [])

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys)
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
        }
    }

    const logout = async () => {
        auth.logout(navigate)
        navigate('/')
    }

    const getSurplus = async () => {
        try {
            layoutInit.setLoading(true)
            const result = await getUserSurplus()
            if (result.data) {
                setSurplus(result.data?.data.details.acc_credit)
            }
            layoutInit.setLoading(false)
        } catch (error) {
            console.log(error)
            layoutInit.setLoading(false)
        }
    }

    const getNotification = async () => {
        try {
            layoutInit.setLoading(true)
            const result = await getNotificationByUser(notificationType)
            if (result.data?.notifications) {
                setNotifications(result.data.notifications)
            }
            layoutInit.setLoading(false)
        } catch (error) {
            console.log(error)
            layoutInit.setLoading(false)
        }
    }

    const countUnReadNotification = useMemo(() => {
        let count = 0
        notifications.forEach((item) => {
            if (!item.readBy.includes(auth.user?.id!)) {
                count++
            }
        })
        return count
    }, [notifications])

    let menuAdmin = [
        {
            icon: <MdManageAccounts />,
            label: 'NHÀ QUẢN LÝ',
            key: '/admin',
            children: [
                {
                    key: '/os',
                    icon: <MdOutlineSettingsSystemDaydream />,
                    label: 'Hệ điều hành',
                    children: [
                        {
                            key: '/operating-system',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/operating-system'}>
                                    Danh sách
                                </NavLink>
                            ),
                        },
                        {
                            key: '/operating-system/create-operating-system',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink
                                    to={
                                        '/operating-system/create-operating-system'
                                    }
                                >
                                    Thêm hệ điều hành
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/manage-ip',
                    icon: <MdOutlineSettingsSystemDaydream />,
                    label: 'Quản lí IP',
                    children: [
                        {
                            key: '/manage-ip',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/manage-ip'}>Danh sách</NavLink>
                            ),
                        },
                        {
                            key: '/manage-ip/create',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink to={'/manage-ip/create'}>
                                    Thêm địa chỉ Ip
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/manage-user',
                    icon: <BiUser />,
                    label: 'Quản lí người dùng',
                    children: [
                        {
                            key: '/manage-user',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/manage-user'}>Danh sách</NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/lc',
                    icon: <SlLocationPin />,
                    label: 'Khu vực',
                    children: [
                        {
                            key: '/location',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/location'}>Danh sách</NavLink>
                            ),
                        },
                        {
                            key: '/location/create-location',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink to={'/location/create-location'}>
                                    Thêm khu vực
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/serve',
                    icon: <MdHomeRepairService />,
                    label: 'Gói dịch vụ',
                    children: [
                        {
                            key: '/service',
                            icon: <BsCardChecklist />,
                            label: <NavLink to={'/service'}>Danh sách</NavLink>,
                        },
                        {
                            key: '/service/create-service',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink to={'/service/create-service'}>
                                    Thêm dịch vụ
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/manage-ticket',
                    icon: <TbTicket />,
                    label: (
                        <NavLink to={'/manage-ticket'}>Quản lý ticket</NavLink>
                    ),
                },
                {
                    key: '/notify',
                    icon: <AiOutlineNotification />,
                    label: 'Quản lý thông báo',
                    children: [
                        {
                            key: '/notification',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/notification'}>
                                    Danh sách
                                </NavLink>
                            ),
                        },
                        {
                            key: '/notification/create-notification',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink
                                    to={'/notification/create-notification'}
                                >
                                    Tạo thông báo
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/manage-deposit-guide',
                    icon: <RiMoneyPoundBoxLine />,
                    label: (
                        <NavLink to={'/manage-deposit-guide'}>
                            Quản lý nạp tiền
                        </NavLink>
                    ),
                },
                {
                    key: '/manage-department',
                    icon: <BiBuildingHouse />,
                    label: 'Quản lý phòng ban',
                    children: [
                        {
                            key: '/department',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/department'}>Danh sách</NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/order',
                    icon: <FiShoppingCart />,
                    label: 'Quản lý đơn hàng',
                    children: [
                        {
                            key: '/manage-order',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/manage-order'}>
                                    Danh sách
                                </NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/user-statistic',
                    icon: <IoStatsChart />,
                    label: (
                        <NavLink to={'/user-statistic'}>
                            Thống kê người dùng
                        </NavLink>
                    ),
                },
                {
                    key: '/operation-history',
                    icon: <FaHistory />,
                    label: (
                        <NavLink to={'/operation-history'}>
                            Lịch sử thao tác
                        </NavLink>
                    ),
                },
            ],
        },
    ]

    let menu = [
        {
            key: '/manage',
            icon: <CgList />,
            label: 'QUẢN LÝ',
            children: [
                // {
                //     key: '/cloud',
                //     icon: <MdOutlineComputer />,
                //     label: 'Cloud VPS',
                //     children: [
                //         {
                //             key: '/cloud-vps',
                //             icon: <BsCardChecklist />,
                //             label: (
                //                 <NavLink to={'/cloud-vps'}>Danh sách</NavLink>
                //             ),
                //         },
                //         {
                //             key: '/cloud-vps/create-cloud',
                //             icon: <MdOutlineAddLink />,
                //             label: (
                //                 <NavLink to={'/cloud-vps/create-cloud'}>
                //                     Tạo mới cloud server
                //                 </NavLink>
                //             ),
                //         },
                //     ],
                // },
                {
                    key: '/services',
                    icon: <HiOutlineDesktopComputer />,
                    label: 'Service',
                    children: [
                        {
                            key: '/service-list',
                            icon: <BsCardChecklist />,
                            label: (
                                <NavLink to={'/services'}>Danh sách</NavLink>
                            ),
                        },
                    ],
                },
                {
                    key: '/action-history',
                    icon: <BsMenuButtonWide />,
                    label: (
                        <NavLink to={'/action-history'}>
                            Lịch sử thao tác
                        </NavLink>
                    ),
                },
                {
                    key: '/sp',
                    icon: <BsHeadphones />,
                    label: 'Hỗ trợ',
                    children: [
                        {
                            key: '/support',
                            icon: <BsCardChecklist />,
                            label: <NavLink to={'/support'}>Danh sách</NavLink>,
                        },
                        {
                            key: '/support/create-ticket',
                            icon: <AiOutlineAppstoreAdd />,
                            label: (
                                <NavLink to={'/support/create-ticket'}>
                                    Tạo ticket
                                </NavLink>
                            ),
                        },
                    ],
                },
            ],
        },

        {
            key: '/information',
            icon: <HiOutlineInformationCircle />,
            label: 'THÔNG TIN',
            children: [
                {
                    key: '/invoices',
                    icon: <TbFileInvoice />,
                    label: <NavLink to={'/invoices'}>Hóa đơn</NavLink>,
                },
                {
                    key: '/deposit-guide',
                    icon: <MdOutlineSupportAgent />,
                    label: (
                        <NavLink to={'/deposit-guide'}>
                            Hướng dẫn nạp tiền
                        </NavLink>
                    ),
                },
                {
                    key: '/transaction',
                    icon: <MdOutlineHistory />,
                    label: (
                        <NavLink to={'/transaction'}>Lịch sử giao dịch</NavLink>
                    ),
                },
                {
                    key: '/deposit-check',
                    icon: <BsCheckLg />,
                    label: (
                        <NavLink to={'/deposit-check'}>
                            Kiểm tra nạp tiền
                        </NavLink>
                    ),
                },
            ],
        },
    ]
    let menuSidebar = []
    const layout = useLayoutInit()

    const getMenu = (roleName = '') => {
        switch (roleName) {
            case 'admin':
                return [...menuAdmin, ...menu]
            default:
                return [...menu]
        }
    }

    if (true) {
        menuSidebar = menu.concat(menuAdmin)
    } else {
        menuSidebar = menu
    }

    useEffect(() => {
        getSurplus()

        socket.emit('user connect', {
            userId: auth.user && auth.user._id,
        })
        socket.on('new notification is sent', (msg) => {
            notify(notifyType.NOTIFY_SUCCESS, 'Bạn có 1 thông báo mới')
            setNotifications((state) => [msg, ...state])
        })
        socket.on('new ticket is created', (msg) => {
            notify(notifyType.NOTIFY_SUCCESS, 'Một ticket đã được gửi đến')
        })
        socket.on('set surplus', (msg) => {
            setSurplus(msg)
        })
    }, [])

    useEffect(() => {
        getNotification()
    }, [notificationType])

    useEffect(() => {
        //@ts-ignore
        const handleClickOutSide = (e) => {
            //@ts-ignore
            if (refPanel.current && !refPanel.current.contains(e.target)) {
                setPanel(false)
            }
            //@ts-ignore
            if (
                refUserOption.current &&
                //@ts-ignore
                !refUserOption.current.contains(e.target)
            ) {
                setUserOption(false)
            }
            //@ts-ignore
            if (
                refNotificationBox.current &&
                //@ts-ignore
                !refNotificationBox.current.contains(e.target)
            ) {
                setNotificationBox(false)
            }
        }
        document.addEventListener('click', handleClickOutSide, true)
    }, [])

    return (
        <>
            {panel && <BlurGlass />}
            <ModalConfirm />
            {layout.loading && <Loading />}
            <SocketContext.Provider value={socket}>
                <Layout style={{ minHeight: '100vh' }}>
                    {!isMobile && (
                        <Sider
                            trigger={null}
                            collapsible
                            collapsed={collapsed}
                            width={'15%'}
                            breakpoint="lg"
                            collapsedWidth={60}
                            onBreakpoint={(broken) => {
                                if (broken) {
                                    setCollapsed(true)
                                } else {
                                    setCollapsed(false)
                                }
                            }}
                        >
                            <div className="logo-navbar">
                                {!collapsed && (
                                    <Link
                                        to={'/'}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            width={170}
                                            src={appConfig.PROJECT == 'vietstack' ? '/images/Logo-vietserver.png' : '/images/Logo.png'}
                                        />
                                    </Link>
                                )}
                            </div>
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={['/']}
                                selectedKeys={[location.pathname]}
                                items={getMenu(
                                    typeof auth.user?.role != 'string'
                                        ? auth.user?.role?.roleName
                                        : ''
                                )}
                                onOpenChange={onOpenChange}
                                openKeys={openKeys}
                            />
                        </Sider>
                    )}
                    <Layout className="site-layout">
                        {isMobile && (
                            <Header>
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    defaultSelectedKeys={['/']}
                                    selectedKeys={[location.pathname]}
                                    items={menuSidebar}
                                />
                            </Header>
                        )}
                        <Header
                            className="site-layout-background"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div className="site-layout-column">
                                {React.createElement(
                                    collapsed
                                        ? MenuUnfoldOutlined
                                        : MenuFoldOutlined,
                                    {
                                        className: 'trigger',
                                        onClick: () => setCollapsed(!collapsed),
                                    }
                                )}
                                <div className="site-layout-create-server">
                                    <Link to={'/cloud-vps/create-cloud'}>
                                        <div className="site-layout-create-server-button">
                                            <AiOutlinePlus />
                                            <span>Tạo mới cloud server</span>
                                        </div>
                                    </Link>
                                </div>
                                {/* <div className="site-layout-create-server">
                                    <Link to={'/support/create-ticket'}>
                                        <div className="site-layout-create-server-ticket">
                                            <AiOutlinePlus />
                                            <span>Tạo ticket</span>
                                        </div>
                                    </Link>
                                </div> */}
                            </div>
                            <div className="site-layout-column">
                                <div className="site-layout-purchase">
                                    <Link to={'/deposit-guide'}>
                                        <div className="site-layout-purchase-button">
                                            Nạp tiền
                                        </div>
                                    </Link>
                                </div>
                                <div className="site-layout-surplus">
                                    <p>
                                        Số dư:
                                        <span style={{ fontSize: '15px' }}>
                                            {formatMoney(
                                                Math.ceil(Number(surplus))
                                            )}
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className="site-layout-appstore"
                                    ref={refPanel}
                                >
                                    <AiOutlineAppstore
                                        size={20}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#3699ff',
                                        }}
                                        onClick={() => setPanel(true)}
                                    />
                                    {panel && (
                                        <div className="site-layout-appstore-panel">
                                            <div className="site-layout-appstore-panel-header">
                                                <FaTimes
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    size={20}
                                                    onClick={() =>
                                                        setPanel(false)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="site-layout-notification"
                                    ref={refNotificationBox}
                                >
                                    <span
                                        className="site-layout-notification-ring"
                                        onClick={() => {
                                            setNotificationBox(!notificationBox)
                                            setUserOption(false)
                                        }}
                                    ></span>
                                    <AiFillBell
                                        className="site-layout-notification-icon"
                                        size={20}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#3699ff',
                                        }}
                                        onClick={() => {
                                            setNotificationBox(!notificationBox)
                                            setUserOption(false)
                                        }}
                                    />
                                    {notificationBox && (
                                        <div className="site-layout-notification-box">
                                            <div className="site-layout-notification-box-content-wrapper">
                                                <div className="site-layout-notification-box-content">
                                                    <div className="site-layout-notification-box-content-text">
                                                        <p>Thông báo</p>
                                                        <div className="site-layout-notification-box-content-quantity">
                                                            <span>
                                                                {
                                                                    countUnReadNotification
                                                                }{' '}
                                                                new
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul>
                                                    <li
                                                        style={
                                                            notificationType ==
                                                            'all'
                                                                ? {
                                                                      borderBottom:
                                                                          '3px solid #1bc5bd',
                                                                      fontSize:
                                                                          '17px',
                                                                      padding:
                                                                          '0 10px',
                                                                      cursor: 'pointer',
                                                                  }
                                                                : {
                                                                      fontSize:
                                                                          '17px',
                                                                      padding:
                                                                          '0 10px',
                                                                      cursor: 'pointer',
                                                                  }
                                                        }
                                                        onClick={() =>
                                                            setNotificationType(
                                                                'all'
                                                            )
                                                        }
                                                    >
                                                        Tất cả
                                                    </li>
                                                    <li
                                                        style={
                                                            notificationType ==
                                                            'shopping'
                                                                ? {
                                                                      borderBottom:
                                                                          '3px solid #1bc5bd',
                                                                  }
                                                                : {}
                                                        }
                                                        onClick={() =>
                                                            setNotificationType(
                                                                'shopping'
                                                            )
                                                        }
                                                    >
                                                        <AiOutlineShoppingCart
                                                            size={24}
                                                            style={{
                                                                verticalAlign:
                                                                    '-4px',
                                                                boxSizing:
                                                                    'content-box',
                                                            }}
                                                        />
                                                    </li>
                                                    <li
                                                        style={
                                                            notificationType ==
                                                            'cash'
                                                                ? {
                                                                      borderBottom:
                                                                          '3px solid #1bc5bd',
                                                                  }
                                                                : {}
                                                        }
                                                        onClick={() =>
                                                            setNotificationType(
                                                                'cash'
                                                            )
                                                        }
                                                    >
                                                        <FaMoneyBillAlt
                                                            size={24}
                                                            style={{
                                                                verticalAlign:
                                                                    '-4px',
                                                                boxSizing:
                                                                    'content-box',
                                                            }}
                                                        />
                                                    </li>
                                                    <li
                                                        style={
                                                            notificationType ==
                                                            'ticket'
                                                                ? {
                                                                      borderBottom:
                                                                          '3px solid #1bc5bd',
                                                                  }
                                                                : {}
                                                        }
                                                        onClick={() =>
                                                            setNotificationType(
                                                                'ticket'
                                                            )
                                                        }
                                                    >
                                                        <RiTicketLine
                                                            size={24}
                                                            style={{
                                                                verticalAlign:
                                                                    '-4px',
                                                                boxSizing:
                                                                    'content-box',
                                                            }}
                                                        />
                                                    </li>
                                                    <li
                                                        style={
                                                            notificationType ==
                                                            'home'
                                                                ? {
                                                                      borderBottom:
                                                                          '3px solid #1bc5bd',
                                                                  }
                                                                : {}
                                                        }
                                                        onClick={() =>
                                                            setNotificationType(
                                                                'home'
                                                            )
                                                        }
                                                    >
                                                        <BiHomeAlt
                                                            size={24}
                                                            style={{
                                                                verticalAlign:
                                                                    '-4px',
                                                                boxSizing:
                                                                    'content-box',
                                                            }}
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="site-layout-notification-box-content-list">
                                                {notifications.map((item) => (
                                                    <React.Fragment
                                                        key={item._id}
                                                    >
                                                        <Link
                                                            to={`/notification/${item.slug}`}
                                                        >
                                                            <p
                                                                style={
                                                                    !item.readBy.includes(
                                                                        auth
                                                                            .user
                                                                            ?.id!
                                                                    )
                                                                        ? {
                                                                              backgroundColor:
                                                                                  '#edf0f0',
                                                                              marginBottom:
                                                                                  '0',
                                                                          }
                                                                        : {
                                                                              marginBottom:
                                                                                  '0',
                                                                          }
                                                                }
                                                            >
                                                                {item.name}
                                                            </p>
                                                        </Link>
                                                        <Divider
                                                            style={{
                                                                marginTop:
                                                                    '0px',
                                                                marginBottom:
                                                                    '0px',
                                                                border: '0.5px solid #dedcdc',
                                                            }}
                                                        />
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="site-layout-avatar"
                                    ref={refUserOption}
                                >
                                    <Link
                                        className="site-layout-avatar-username"
                                        to="/profile"
                                        style={{ verticalAlign: '-2px' }}
                                    >
                                        Hi,{' '}
                                        {`${auth.user?.firstname} ${auth.user?.lastname}`}
                                    </Link>
                                    <Avatar
                                        onClick={() => {
                                            setUserOption(!userOption)
                                            setNotificationBox(false)
                                        }}
                                        size={35}
                                        icon={
                                            <UserOutlined
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    transform:
                                                        'translate(-50%, -50%)',
                                                    left: '50%',
                                                }}
                                            />
                                        }
                                        style={{
                                            cursor: 'pointer',
                                            marginLeft: '10px',
                                        }}
                                    />
                                    {userOption && (
                                        <div className="site-layout-avatar--option">
                                            <ul>
                                                <li
                                                    style={{ lineHeight: 6 }}
                                                    className="bg-img"
                                                >
                                                    <UserOutlined
                                                        style={{
                                                            verticalAlign:
                                                                '1px',
                                                            fontSize: '2rem',
                                                        }}
                                                    />
                                                    <span
                                                        style={{
                                                            marginLeft: '5px',
                                                        }}
                                                    >
                                                        {auth.user?.firstname}{' '}
                                                        {auth.user?.lastname}
                                                    </span>
                                                </li>
                                                <li
                                                    style={{ lineHeight: 2 }}
                                                    className="bg-img"
                                                >
                                                    <span>
                                                        Số dư:{' '}
                                                        {formatMoney(
                                                            Math.ceil(
                                                                Number(surplus)
                                                            )
                                                        )}
                                                    </span>
                                                </li>
                                                <Divider
                                                    style={{
                                                        margin: '0',
                                                        border: '0.5px solid gray',
                                                    }}
                                                />
                                                <Link to="/profile">
                                                    {/* <div style={{display:'flex',alignItems:"center"}}> */}

                                                    <li className="info_profile">
                                                        <ImProfile
                                                            size={20}
                                                            color={'#1890ff'}
                                                            className="icon_profile"
                                                        />
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                                fontSize:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Thông tin tài khoản
                                                        </span>
                                                    </li>
                                                    {/* </div> */}
                                                </Link>
                                                <Link to="/change-password">
                                                    <li className="info_profile">
                                                        <RiLockPasswordLine
                                                            size={20}
                                                            color={'#1890ff'}
                                                            className="icon_profile"
                                                        />
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                                fontSize:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Thay đổi mật khẩu
                                                        </span>
                                                    </li>
                                                </Link>
                                                <Link to="/2fa-security">
                                                    <li className="info_profile">
                                                        <MdOutlineSecurity
                                                            size={20}
                                                            color={'#1890ff'}
                                                            className="icon_profile"
                                                        />
                                                        <span
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                                fontSize:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Cài đặt bảo mật
                                                            (2FA)
                                                        </span>
                                                    </li>
                                                </Link>

                                                <li onClick={() => logout()}>
                                                    <Link to="#">
                                                        <span>Đăng xuất</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Header>
                        <Content
                            className="site-layout-background"
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </SocketContext.Provider>
        </>
    )
}

export default MainLayout

export { socket }
