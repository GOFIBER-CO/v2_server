import { notify, notifyType } from '@/App'
import ButtonFilter from '@/components/ButtonFilter'
import CloudVPSDetail from '@/components/CloudVPS/CloudVPSDetail/CloudVPSDetail'
import RenewModal from '@/components/CloudVPS/RenewModal'
import formatDate from '@/helpers/formatDate'
import subtractDate from '@/helpers/subtractDate'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { ListMenuCloud } from '@/interfaces/DataDefault/ListMenuCloud'
import IArea from '@/interfaces/IArea'
import ICloudServer from '@/interfaces/ICloudServer'
import IMenuCloud from '@/interfaces/IMenuCloud'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import IOrder from '@/interfaces/IOrder'
import {
    deleteCloudServer,
    getCloudVpsByUserId,
    getLocations,
    getOs,
    switchAutoRenew,
} from '@/services/apis'
import '@/styles/pages/CloudVps/CloudVps.scss'
import {
    Divider,
    Dropdown,
    Input,
    Menu,
    message,
    Pagination,
    PaginationProps,
    Select,
    Switch,
    Table,
    Tag,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { CSSProperties, useContext, useEffect, useState } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { FaCog } from 'react-icons/fa'
import { TbFileExport } from 'react-icons/tb'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link, useNavigate } from 'react-router-dom'
import './CloudVps.scss'
import Modalprint from './Modalprint'
import { useReactToPrint } from 'react-to-print'
import { SocketContext } from '@/socket'
import {
    getCloudVpsByUserIdVietTell,
    shutDownCloud,
    startCloud,
} from '@/services/apiv2'

const { Option } = Select

const CloudVps: React.FC = () => {
    const socket = useContext(SocketContext)
    const [filter, setFilter] = useState<{
        location: string
        operatingSystem: string
        name: string
    }>({
        location: '',
        operatingSystem: '',
        name: '',
    })

    const [renewModal, setRenewModal] = useState<{
        isOpen: boolean
        id: string
    }>({ isOpen: false, id: '' })
    const [listMenuCloud, setListMenuCloud] = useState(ListMenuCloud)

    const [cloudServer, setCloudServer] = useState<any>([])
    const [cloudServerItem, setCloudServerItem] = useState<ICloudServer>()

    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [location, setLocation] = useState<IArea[]>([])
    const [order, setOrder] = useState<IOrder[]>([])
    const [operatingSystem, setOperatingSystem] = useState<any>([])
    const [optionCloud, setOptionCloud] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`
    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }

    //print
    const componentRef = React.useRef(null)
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current
    }, [componentRef.current])

    const onBeforeGetContentResolve = React.useRef(null)

    const [loading, setLoading] = React.useState(false)
    const [none, setNone] = React.useState('')
    const navigate = useNavigate()

    const handleOnBeforeGetContent = React.useCallback(() => {
        // console.log('`onBeforeGetContent` called') // tslint:disable-line no-console
        // setLoading(true);
        // setText("Loading new text...");

        return new Promise((resolve: any) => {
            onBeforeGetContentResolve.current = resolve
            setNone('hiden')
            setTimeout(() => {
                setLoading(false)
                // setText('New, Updated Text!')
                resolve()
            }, 1000)
        })
    }, [])

    const handleBeforePrint = React.useCallback(() => {
        setNone('')
        // console.log("`onBeforePrint` called"); // tslint:disable-line no-console
    }, [])

    const handleAfterPrint = React.useCallback(() => {
        // console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    }, [])
    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'AwesomeFileName',
        onBeforeGetContent: handleOnBeforeGetContent,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        removeAfterPrint: true,
    })

    // const changeIsAutoRenew = async (id: string, status: boolean) => {
    //     try {
    //         const result = await switchAutoRenew(id, status)
    //         const newList = cloudServer.map((item : any) => {
    //             if (item._id == id) item.isAutoRenew = status
    //             return item
    //         })
    //         setCloudServer(newList)
    //         message.success(result.data?.message)
    //     } catch (error) {
    //         console.log(error)
    //         message.error(error)
    //     }
    // }

    const deleteCloud = async (id: string) => {
        try {
            layout.setLoading(true)
            const result = await deleteCloudServer(id)
            const newList = cloudServer.filter((item: any) => item._id != id)
            setCloudServer(newList)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_SUCCESS, 'Hu??? th??nh c??ng')
        } catch (error) {
            console.log(error)
            notify(notifyType.NOTIFY_ERROR, 'Hu??? th???t b???i')
            layout.setLoading(false)
        }
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const shutDownCloudVps = async (cloudVps: ICloudServer) => {
        try {
            const result = shutDownCloud(cloudVps.object_id, cloudVps.service_id)
            notify(
                notifyType.NOTIFY_SUCCESS,
                'Cloud vps ??ang ???????c t???t ngu???n vui l??ng ?????i'
            )
        } catch (error) {
            console.log(error)
        }
    }

    const openCloudVps = async (cloudVps: ICloudServer) => {
        try {
            const result = startCloud(cloudVps.object_id, cloudVps.service_id)
            notify(
                notifyType.NOTIFY_SUCCESS,
                'Cloud vps ??ang ???????c kh???i ?????ng vui l??ng ?????i'
            )
            getCloudServer()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteCloudServerBeforeExp = async (cloudVps: ICloudServer) => {
        try {
        } catch (error) {}
    }

    const rebootVps = async (cloudVps: ICloudServer) => {
        try {
        } catch (error) {}
    }

    const auth = useAuth()
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a rel="noopener noreferrer" className="">
                            <i className="fa fa-eye"></i> Chi ti???t Cloud Server
                        </a>
                    ),
                    onClick: () => {
                        if (cloudServerItem) {
                            if (cloudServerItem?.status === 'pending') {
                                navigate(
                                    `/service-detail-payment/${cloudServerItem?.service_id}`
                                )
                                return
                            }

                            let menuCloudItem = listMenuCloud.find(
                                (x) => x.cloudId === cloudServerItem.id
                            )
                            if (!menuCloudItem) {
                                setCloudServerItem(cloudServerItem)
                                let menuCloudItem: IMenuCloud = {
                                    optionId: listMenuCloud.length + 1,
                                    name:
                                        'Chi ti???t Cloud Vps #' +
                                        cloudServerItem.object_id,
                                    isCloud: true,
                                    cloudId: cloudServerItem.id || '',
                                    cloudItem: cloudServerItem,
                                    url: '',
                                }
                                listMenuCloud.push(menuCloudItem)
                                setListMenuCloud(listMenuCloud)
                                setOptionCloud(listMenuCloud.length)
                            } else {
                                setOptionCloud(
                                    Number(menuCloudItem.cloudId) ||
                                        listMenuCloud.length
                                )
                            }
                        }
                    },
                },
                {
                    key: '2',
                    label: (
                        <a
                            rel="noopener noreferrer"
                            onClick={() =>
                                setRenewModal({
                                    isOpen: true,
                                    id: cloudServerItem?.id || '',
                                })
                            }
                        >
                            <i className="fa fa-file text-primary"></i> Gia h???n
                            Cloud Server
                        </a>
                    ),
                    //   icon: <SmileOutlined />,
                    disabled: false,
                },
                {
                    key: '',
                    label: <Divider style={{ margin: '0' }} />,
                },
                {
                    key: '3',
                    label: (
                        <span>
                            <i
                                className="fa fa-terminal"
                                style={{ color: '#3699ff' }}
                            ></i>{' '}
                            Xem Console
                        </span>
                    ),
                    disabled: false,
                },
                {
                    key: '4',
                    label: (
                        <span
                            onClick={() => shutDownCloudVps(cloudServerItem!)}
                        >
                            <i
                                className="fa fa-power-off"
                                style={{ color: 'purple' }}
                            ></i>{' '}
                            T???t ngu???n cloud server
                        </span>
                    ),
                    disabled: !cloudServerItem?.power,
                },
                {
                    key: '5',
                    label: (
                        <span onClick={() => openCloudVps(cloudServerItem!)}>
                            <i
                                className="fa fa-play"
                                style={{ color: '#1bc5bd' }}
                            ></i>{' '}
                            M??? ngu???n Cloud server
                        </span>
                    ),
                    disabled: cloudServerItem?.power,
                },
                {
                    key: '6',
                    label: (
                        <span>
                            <i className="fa fa-refresh"></i> Kh???i ?????ng l???i
                        </span>
                    ),
                    disabled: false,
                },
                {
                    key: '7',
                    label: (
                        <Link
                            to={`/cloud-vps/update-cloud/${cloudServerItem?.id}`}
                        >
                            <i className="fa fa-upload"></i>
                            <span> N??ng c???p c???u h??nh</span>
                        </Link>
                    ),
                    disabled: false,
                },
                {
                    key: '8',
                    label: (
                        <span>
                            <i className="fa fa-wrench"></i> C??i l???i h??? ??i???u
                            h??nh
                        </span>
                    ),
                    disabled: false,
                },
                {
                    key: '9',
                    danger: true,
                    label: (
                        <span
                            onClick={() =>
                                layout.setModal(
                                    true,
                                    () =>
                                        deleteCloud(cloudServerItem?.id || ''),
                                    'B???n c?? mu???n hu??? ? H??nh ?????ng n??y l?? kh??ng th??? kh??i ph???c!',
                                    'Hu??? cloud server'
                                )
                            }
                        >
                            <i className="fa fa-recycle"></i> H???y Cloud Server
                            tr?????c h???n
                        </span>
                    ),
                },
                {
                    key: '10',
                    // danger: true,
                    label: (
                        <a
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={showModal}
                        >
                            <TbFileExport style={{ marginRight: '5px' }} />
                            <span>Xu???t h??a ????n</span>
                        </a>
                    ),
                },
            ]}
        />
    )
    const columns: ColumnsType<any> = [
        {
            title: 'M?? server',
            dataIndex: 'object_id',
            // width: '10%',
            // render: (_ : any , record : any, index : any) => {
            //     console.log(_);

            //     return <></>
            // }
        },
        {
            title: 'T??n d???ch v???',
            dataIndex: 'service',
            render: (value) => (
                <>
                    <div>{value?.name}</div>
                    <div>{value?.label ? `(${value?.label})` : ''}</div>
                </>
            ),
        },
        {
            title: 'Domain',
            dataIndex: 'service',
            render: (value) => {
                return <div>{value?.domain}</div>
            },
        },
        {
            title: '?????a ch??? IP',
            dataIndex: 'ip',
            // width: '10%',
            render: (_: any, record: any, index: number) => {
                return <div>{_?.ip ? _?.ip : '-'}</div>
            },
        },
        {
            title: '?????a ch??? IPV4',
            dataIndex: 'ipv4',
            render: (value) => {
                return <div>{value ? value : '-'}</div>
            },
            // width: '10%',
            // render: (_ : any, record:any , index: number) => {

            //     return <>{_?.ipv4}</>
            // }
        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            // width: '8%',
            render: (value) => {
                const GB = value / 1024
                return <>{GB ? `${GB?.toFixed(2)} GB` : '-'}</>
            },
        },
        {
            title: 'Disk',
            dataIndex: 'disk',
            // render: (value, row) => (
            //     <strong>
            //         {row?.order?.totalPrice ? (
            //             <>
            //                 <div className="order_price">
            //                     {Intl.NumberFormat('en-US', {
            //                         maximumFractionDigits: 0,
            //                     }).format(Number(row.order.totalPrice))}
            //                     <small style={{}}>???</small>
            //                 </div>
            //                 <Divider style={{ margin: '5px 0px' }} />
            //                 <span className="unit-price">
            //                     {row.server.expiryDateType === 1 ? (
            //                         <>Gi???</>
            //                     ) : row.server.expiryDateType === 2 ? (
            //                         <>Ng??y</>
            //                     ) : row.server.expiryDateType === 3 ? (
            //                         <>Th??ng</>
            //                     ) : row.server.expiryDateType === 4 ? (
            //                         <>3 Th??ng</>
            //                     ) : row.server.expiryDateType === 5 ? (
            //                         <>6 Th??ng</>
            //                     ) : row.server.expiryDateType === 6 ? (
            //                         <>N??m</>
            //                     ) : null}
            //                 </span>
            //             </>
            //         ) : null}
            //     </strong>
            // ),
            // width: '9%',
        },
        // {
        //     title: 'Ng??y h???t h???n',
        //     dataIndex: 'expiryDate',
        //     width: '12%',
        //     render: (value) => (
        //         <>
        //             <span>{formatDate(value)}</span>
        //             <span style={{ color: 'red', display: 'block' }}>
        //                 {subtractDate(new Date(value), new Date()) / 30 >= 1
        //                     ? `${Math.ceil(
        //                           subtractDate(new Date(value), new Date()) / 30
        //                       )} th??ng t???i`
        //                     : `${subtractDate(
        //                           new Date(value),
        //                           new Date()
        //                       )} ng??y t???i`}{' '}
        //             </span>
        //         </>
        //     ),
        // },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     render: (value, record) => (
        //         <>
        //             <Switch
        //                 checked={value}
        //                 // onChange={(status) =>
        //                 //     changeIsAutoRenew(record._id, status)
        //                 // }
        //                 size="small"
        //             />
        //         </>
        //     ),
        //     width: '6%',
        // },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            // width: '10%',
            render: (value, record) =>
                !record.power ? (
                    <Tag color="yellow">???? t???t ngu???n</Tag>
                ) : value == 'running' ? (
                    <Tag color="green">Ho???t ?????ng</Tag>
                ) : value == 'pending' ? (
                    <Tag color="blue">??ang ch???</Tag>
                ) : (
                    <Tag color="red">Ng??ng</Tag>
                ),

            // : value == 'not-active' ? (
            //     <Tag color="orange">??ang kh???i t???o</Tag>
            // ) : value == 'failed' ? (
            //     <Tag color="red">Kh???i t???o th???t b???i</Tag>
            // ) : value == 'expired' ? <Tag color='red'>H???t h???n</Tag> :(
            //     <Tag color="red">Ng??ng</Tag>
            // ),
        },
        {
            title: '',
            dataIndex: 'server',
            width: '4%',
            render: (item) => (
                <div>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <FaCog />
                        </a>
                    </Dropdown>
                </div>
            ),
            onCell: (item) => {
                return {
                    onClick: () => {
                        // handleAddCloud(item)
                        setCloudServerItem(item)
                    },
                }
            },
        },
    ]

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const handleChangeLocation = (value: string) => {
        setFilter({ ...filter, location: value })
    }
    const handleChangeOs = (value: string) => {
        setFilter({ ...filter, operatingSystem: value })
    }

    const onFilter = () => {
        getCloudServer()
    }

    const getAllLocation = async () => {
        try {
            const result = await getLocations()
            setLocation(result.data?.location)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllOrder = async () => {
        try {
            const result = await getAllOrder()
            // setOrder(result)
        } catch (error) {
            console.log(error)
        }
    }
    // const getOperatingSystem = async () => {
    //     try {
    //         const result = await getOs()
    //         setOperatingSystem(result.data?.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const layout = useLayoutInit()

    const getCloudServer = async () => {
        try {
            layout.setLoading(true)
            const cloudVps = await getCloudVpsByUserIdVietTell(
                // auth.user._id,
                // filter.location,
                // filter.operatingSystem,
                filter.name,
                pageIndex,
                pageSize
            )
            setOperatingSystem(cloudVps?.data?.data)
            setCloudServer(cloudVps?.data?.data)
            setTotalPage(cloudVps.data?.totalPages)
            setTotalItem(cloudVps.data?.totalItem)
            setPageIndex(cloudVps?.data?.pageIndex)
            setPageSize(cloudVps?.data?.pageSize)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const handleChangeOption = (event: IMenuCloud) => {
        setCloudServerItem(event.cloudItem)
        setOptionCloud(event.optionId)
    }

    const handleAddCloud = (item: ICloudServer) => {
        let menuCloudItem = listMenuCloud.find((x) => x.cloudId === item.id)
        if (!menuCloudItem) {
            setCloudServerItem(item)
            let menuCloudItem: IMenuCloud = {
                optionId: listMenuCloud.length + 1,
                name: 'Chi ti???t Cloud Vps #' + item.list_id,
                isCloud: true,
                cloudId: item.id || '',
                cloudItem: item,
                url: '',
            }
            listMenuCloud.push(menuCloudItem)
            setListMenuCloud(listMenuCloud)
            setOptionCloud(listMenuCloud.length)
        } else {
            setCloudServerItem(item)
            setOptionCloud(
                Number(menuCloudItem.cloudId) || listMenuCloud.length
            )
        }
    }

    const handleClockCloud = (item: IMenuCloud) => {
        let newData = [...listMenuCloud]
        if (listMenuCloud.length === 4) {
            newData.pop()
        } else {
            let index = listMenuCloud.indexOf(item)
            newData = newData.filter((x) => x.cloudId !== item.cloudId)
        }
        setOptionCloud(1)
        setListMenuCloud(newData)
    }

    const closeRenewModal = () => {
        setRenewModal({
            isOpen: false,
            id: '',
        })
    }
    // quyquy
    const onChangeNameValue = (value: any) => {
        // console.log('key: ', key);
        // const temp = { ...webRtcInNetWork }
        // temp[key] = value
        // setWebRtcInNetWork(temp)
    }

    useEffect(() => {
        // getAllLocation()
        // getAllOrder()
        getCloudServer()
        // getOperatingSystem()
    }, [pageIndex, pageSize])
    const updateLabelName = (value: any) => {
        console.log('value: ', value)
    }

    useEffect(() => {
        socket.on('Shut down vms success', (msg) => {
            notify(
                notifyType.NOTIFY_SUCCESS,
                'T???t ngu???n cloud server th??nh c??ng'
            )
            getCloudServer()
        })

        socket.on('Shut down vms failed', (msg) => {
            notify(notifyType.NOTIFY_ERROR, 'T???t ngu???n cloud server th???t b???i')
        })

        socket.on('Start vms success', (msg) => {
            notify(
                notifyType.NOTIFY_SUCCESS,
                'Kh???i ?????ng cloud server th??nh c??ng'
            )
            getCloudServer()
        })

        socket.on('Start vms failed', () => {
            notify(notifyType.NOTIFY_ERROR, 'Kh???i ?????ng cloud server th???t b???i')
        })

        socket.on('create cloudserver', (msg) => {
            if (msg.status == 'active')
                notify(
                    notifyType.NOTIFY_SUCCESS,
                    'Cloudserver kh???i t???o th??nh c??ng'
                )
            else
                notify(notifyType.NOTIFY_ERROR, 'Cloudserver kh???i t???o th???t b???i')
            getCloudServer()
        })
        socket.on('set ip success', (msg) => {
            notify(notifyType.NOTIFY_SUCCESS, 'Ip kh???i t???o th??nh c??ng')
            getCloudServer()
        })
        socket.on('set ip failed', (msg) => {
            notify(notifyType.NOTIFY_SUCCESS, 'Ip kh???i t???o th???t b???i')
        })
    }, [])
    // updateLabelName()
    return (
        <React.Fragment>
            {renewModal.isOpen && (
                <RenewModal
                    id={renewModal.id}
                    closeFunction={closeRenewModal}
                />
            )}
            <div className="cloud-vps-page">
                <div className="cloud-vps-page-option">
                    <ul>
                        <Link to={'/cloud-vps'}>
                            <li style={{ borderBottom: '2px solid #3699ff' }}>
                                <TfiMenuAlt
                                    size={15}
                                    style={{
                                        verticalAlign: '-3px',
                                        marginRight: '8px',
                                        color: '#3699ff',
                                    }}
                                />
                                <span>Danh s??ch cloud vps</span>
                            </li>
                        </Link>
                        <Link to={'/cloud-vps/deleted-cloud'}>
                            <li>
                                <TfiMenuAlt
                                    size={15}
                                    style={{
                                        verticalAlign: '-3px',
                                        marginRight: '8px',
                                        color: 'black',
                                    }}
                                />
                                <span>Cloud Server ???? b??? xo??</span>
                            </li>
                        </Link>
                        <Link to={'/cloud-vps/about-to-expired'}>
                            <li>
                                <TfiMenuAlt
                                    size={15}
                                    style={{
                                        verticalAlign: '-3px',
                                        marginRight: '8px',
                                        color: 'black',
                                    }}
                                />
                                <span>Cloud Server s???p h???t h???n</span>
                            </li>
                        </Link>
                    </ul>
                </div>
                {optionCloud > 3 ? (
                    <CloudVPSDetail
                        data={cloudServerItem}
                        // handleChangeNameValue={
                        //    (value)=> onChangeNameValue(value)
                        // }
                        // updateLabelName={handleUpdateLabelName}
                    />
                ) : (
                    <>
                        <div className="cloud-vps-page-filter">
                            <div className="cloud-vps-page-filter-tag">
                                <Input
                                    type="text"
                                    onChange={(e) =>
                                        setFilter({
                                            ...filter,
                                            name: e.target.value,
                                        })
                                    }
                                    style={{ width: '200px' }}
                                    placeholder="T??n cloud vps 0001"
                                />
                            </div>

                            {/* <div className="cloud-vps-page-filter-os">
                                <Select
                                    defaultValue=""
                                    style={{ width: 180 }}
                                    onChange={handleChangeOs}
                                >
                                    <Option value="">H??? ??i???u h??nh</Option>
                                    {operatingSystem.map((item : any) => (
                                        <Option key={item._id} value={item._id}>
                                            {item.operatingSystemName}
                                        </Option>
                                    ))}
                                </Select>
                            </div> */}
                            {/* <div className="cloud-vps-page-filter-location">
                                <Select
                                    defaultValue=""
                                    style={{ width: 180 }}
                                    onChange={handleChangeLocation}
                                >
                                    <Option value="">V??? tr??</Option>
                                    {location.map((item) => (
                                        <Option key={item._id} value={item._id}>
                                            {item.areaName}
                                        </Option>
                                    ))}
                                </Select>
                            </div> */}
                            <div className="cloud-vps-page-filter-submit">
                                <ButtonFilter buttonOnclick={onFilter} />
                            </div>
                        </div>
                        <div className="cloud-vps-page-table">
                            <Table
                                columns={columns}
                                dataSource={cloudServer}
                                scroll={{ x: '1200px', y: '600px' }}
                                pagination={false}
                                sticky
                                rowKey="_id"
                            />
                            <Pagination
                                showSizeChanger
                                showTotal={showTotal}
                                style={{ marginTop: '30px' }}
                                current={pageIndex}
                                defaultCurrent={pageIndex}
                                total={totalItem}
                                pageSize={pageSize}
                                onChange={(value, pageSize) => {
                                    setPageIndex(value)
                                    setPageSize(pageSize)
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
            <Modalprint
                handleCancel={handleCancel}
                handleOk={handleOk}
                isModalOpen={isModalOpen}
                handlePrint={handlePrint}
                componentRef={componentRef}
                none={none}
            />
        </React.Fragment>
    )
}

export default CloudVps
