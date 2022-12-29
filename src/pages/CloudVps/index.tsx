import '@/styles/pages/CloudVps/CloudVps.scss'
import React, { CSSProperties, useEffect, useState } from 'react'
import { TfiClose, TfiEye, TfiMenuAlt } from 'react-icons/tfi'
import {
    Button,
    Input,
    PaginationProps,
    Select,
    Tag,
    Dropdown,
    Menu,
    Space,
    Switch,
    Divider,
    message,
} from 'antd'
import ButtonFilter from '@/components/ButtonFilter'
import { ColumnsType } from 'antd/lib/table'
import { Table } from 'antd'
import { Pagination } from 'antd'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import {
    deleteCloudServer,
    getCloudVpsByUserId,
    getLocations,
    getOrders,
    getOs,
    switchAutoRenew,
} from '@/services/apis'
import ICloudServer from '@/interfaces/ICloudServer'
import { BiEdit } from 'react-icons/bi'
import { AiOutlineDelete, AiOutlineRadarChart } from 'react-icons/ai'
import { FaCog } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import formatDate from '@/helpers/formatDate'
import IArea from '@/interfaces/IArea'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import CloudVPSDetail from '@/components/CloudVPS/CloudVPSDetail/CloudVPSDetail'
import { ListMenuCloud } from '@/interfaces/DataDefault/ListMenuCloud'
import MenuCloud from '@/components/CloudVPS/MenuCloud'
import IMenuCloud from '@/interfaces/IMenuCloud'
import IOrder from '@/interfaces/IOrder'
import Area from '@/components/Area/Area'
import { notify, notifyType } from '@/App'
import { triggerAsyncId } from 'async_hooks'
import subtractDate from '@/helpers/subtractDate'
import { Link } from 'react-router-dom'
import RenewModal from '@/components/CloudVPS/RenewModal'
import { Value } from 'sass'
const { Option } = Select

const CloudVps: React.FC = () => {
    const [filter, setFilter] = useState<{
        location: string
        operatingSystem: string
        name: string
    }>({
        location: '',
        operatingSystem: '',
        name: '',
    })

    const [renewModal, setRenewModal] = useState<{ isOpen: boolean, id: string }>({ isOpen: false, id: '' })
    const [listMenuCloud, setListMenuCloud] = useState(ListMenuCloud)
    const [cloudServer, setCloudServer] = useState<ICloudServer[]>([])
    const [cloudServerItem, setCloudServerItem] = useState<ICloudServer>()
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [location, setLocation] = useState<IArea[]>([])
    const [order, setOrder] = useState<IOrder[]>([])
    const [operatingSystem, setOperatingSystem] = useState<
        IOparatingSystemArray[]
    >([])
    const [optionCloud, setOptionCloud] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`
    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }

    const changeIsAutoRenew = async (id: string, status: boolean) => {
        try {
            const result = await switchAutoRenew(id, status)
            const newList = cloudServer.map((item) => {
                if (item._id == id) item.isAutoRenew = status
                return item
            })
            setCloudServer(newList)
            message.success(result.data?.message)
        } catch (error) {
            console.log(error)
            message.error(error)
        }
    }

    const deleteCloud = async (id: string) => {
        try {
            layout.setLoading(true)
            const result = await deleteCloudServer(id)
            const newList = cloudServer.filter((item) => item._id != id)
            setCloudServer(newList)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_SUCCESS, 'Huỷ thành công')
        } catch (error) {
            console.log(error)
            notify(notifyType.NOTIFY_ERROR, 'Huỷ thất bại')
            layout.setLoading(false)
        }
    }

    const auth = useAuth()
    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a
                            rel="noopener noreferrer"
                            className=""
                        >
                            <i className="fa fa-eye"></i> Chi tiết Cloud Server
                        </a>
                    ),
                    onClick: () => {
                        if (cloudServerItem) {
                            let menuCloudItem = listMenuCloud.find(
                                (x) => x.cloudId === cloudServerItem._id
                            )
                            if (!menuCloudItem) {
                                setCloudServerItem(cloudServerItem)
                                let menuCloudItem: IMenuCloud = {
                                    optionId: listMenuCloud.length + 1,
                                    name:
                                        'Chi tiết Cloud Vps #' +
                                        cloudServerItem.code,
                                    isCloud: true,
                                    cloudId: cloudServerItem._id || '',
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
                            onClick={() => setRenewModal({ isOpen: true, id: cloudServerItem?._id || '' })}
                        >
                            <i className="fa fa-file text-primary"></i> Gia hạn
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
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i
                                className="fa fa-terminal"
                                style={{ color: '#3699ff' }}
                            ></i>{' '}
                            Xem Console
                        </a>
                    ),
                    disabled: false,
                },
                {
                    key: '4',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i
                                className="fa fa-power-off"
                                style={{ color: 'purple' }}
                            ></i>{' '}
                            Tắt nguồn cloud server
                        </a>
                    ),
                    disabled: true,
                },
                {
                    key: '5',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i
                                className="fa fa-play"
                                style={{ color: '#1bc5bd' }}
                            ></i>{' '}
                            Mở nguồn Cloud server
                        </a>
                    ),
                    disabled: false,
                },
                {
                    key: '6',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i className="fa fa-refresh"></i> Khởi động lại
                        </a>
                    ),
                    disabled: false,
                },
                {
                    key: '7',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i className="fa fa-upload"></i> Nâng cấp cấu hình
                        </a>
                    ),
                    disabled: false,
                },
                {
                    key: '8',
                    label: (
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.luohanacademy.com"
                        >
                            <i className="fa fa-wrench"></i> Cài lại hệ điều
                            hành
                        </a>
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
                                        deleteCloud(cloudServerItem?._id || ''),
                                    'Bạn có muốn huỷ ? Hành động này là không thể khôi phục!',
                                    'Huỷ cloud server'
                                )
                            }
                        >
                            <i className="fa fa-recycle"></i> Hủy Cloud Server
                            trước hạn
                        </span>
                    ),
                },
            ]}
        />
    )
    const columns: ColumnsType<ICloudServer> = [
        {
            title: 'Mã server',
            dataIndex: 'code',
            width: '8.5%',
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'server',
            render: (value) => (
                <div>
                    <a className="server_title">{value.serverName}</a>
                    <div>
                        {value.ram}GB | {value.cpu}vCPUs | {value.ssd || value.hdd}GB NVMe {value.ssd ? '(SSD)' : '(HDD)'}
                    </div>
                </div>
            ),
            width: '18%',

            onCell: (item) => {
                return {
                    onClick: () => {
                        handleAddCloud(item)
                        setOptionCloud(listMenuCloud.length)
                    },
                }
            },
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: ['server', 'area'],
            width: '15%',
            render: (value, row) => (
                <>
                    <img
                        src={`/images/${row.area.file}`}
                        style={{ maxWidth: '25px', maxHeight: '25px' }}
                    />
                    <strong style={{ fontSize: '12px' }}>
                        {' '}
                        {row.server.ipv4}
                    </strong>
                    <br />
                    <span>{row.area.areaName}</span>
                </>
            ),
        },
        {
            title: 'HĐH',
            dataIndex: 'operatingSystem',
            width: '5%',
            render: (value) => (
                <>
                    <img
                        src={value.img}
                        style={{ maxWidth: '25px', maxHeight: '25px' }}
                    />
                </>
            ),
        },
        {
            title: 'Hoá đơn',
            dataIndex: ['order', 'server'],
            render: (value, row) => (
                <strong>
                    {row?.order?.totalPrice ? (
                        <>
                            <div className="order_price">
                                {Intl.NumberFormat('en-US', {
                                    maximumFractionDigits: 0,
                                }).format(Number(row.order.totalPrice))}
                                <small style={{}}>₫</small>
                            </div>
                            <span className="unit-price">
                                {row.server.expiryDateType === 1 ? (
                                    <>Giờ</>
                                ) : row.server.expiryDateType === 2 ? (
                                    <>Ngày</>
                                ) : row.server.expiryDateType === 3 ? (
                                    <>Tháng</>
                                ) : row.server.expiryDateType === 4 ? (
                                    <>3 Tháng</>
                                ) : row.server.expiryDateType === 5 ? (
                                    <>6 Tháng</>
                                ) : row.server.expiryDateType === 6 ? (
                                    <>Năm</>
                                ) : null}
                            </span>
                        </>
                    ) : null}
                </strong>
            ),
            width: '7.5%',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiryDate',
            render: (value) => (
                <>
                    <span>{formatDate(value)}</span>
                    <span style={{ color: 'red', display: 'block' }}>
                        {subtractDate(new Date(value), new Date()) / 30 >= 1
                            ? `${Math.ceil(
                                subtractDate(new Date(value), new Date()) / 30
                            )} tháng tới`
                            : `${subtractDate(
                                new Date(value),
                                new Date()
                            )} ngày tới`}{' '}
                    </span>
                </>
            ),
        },
        {
            title: 'GHTĐ',
            dataIndex: 'isAutoRenew',
            render: (value, record) => (
                <>
                    <Switch
                        checked={value}
                        onChange={(status) =>
                            changeIsAutoRenew(record._id, status)
                        }
                        size="small"
                    />
                </>
            ),
            width: '6%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) =>
                value ? (
                    <Tag color="green">Hoạt động</Tag>
                ) : (
                    <Tag color="red">Ngưng</Tag>
                ),
        },
        {
            title: 'Nhãn dịch vụ',
            dataIndex: 'cloudServerName',
        },
        {
            title: 'Điều khiển',
            dataIndex: 'server',
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
            width: '8%',
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
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    const getOperatingSystem = async () => {
        try {
            const result = await getOs()
            setOperatingSystem(result.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const layout = useLayoutInit()

    const getCloudServer = async () => {
        try {
            layout.setLoading(true)
            const cloudVps = await getCloudVpsByUserId(
                auth.user._id,
                filter.location,
                filter.operatingSystem,
                filter.name,
                pageIndex
            )
            console.log(cloudVps)
            setCloudServer(cloudVps.data?.data)
            setTotalPage(cloudVps.data?.totalPages)
            setPageSize(cloudVps.data?.pageSize)
            setTotalItem(cloudVps.data?.totalItem)
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
        let menuCloudItem = listMenuCloud.find((x) => x.cloudId === item._id)
        if (!menuCloudItem) {
            setCloudServerItem(item)
            let menuCloudItem: IMenuCloud = {
                optionId: listMenuCloud.length + 1,
                name: 'Chi tiết Cloud Vps #' + item.code,
                isCloud: true,
                cloudId: item._id || '',
                cloudItem: item,
                url: ''
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
        console.log('value: ', value);
        // console.log('key: ', key);

        // const temp = { ...webRtcInNetWork }
        // temp[key] = value
        // setWebRtcInNetWork(temp)
    }

    useEffect(() => {
        getCloudServer()
        getAllLocation()
        // getAllOrder()
        getOperatingSystem()
    }, [pageIndex])
    const updateLabelName = (value: any) => {
        console.log('value: ', value);
    }
    // updateLabelName()
    return (
        <React.Fragment>
            {renewModal.isOpen && <RenewModal id={renewModal.id} closeFunction={closeRenewModal} />}
            <div className="cloud-vps-page">
                <div className="cloud-vps-page-option">
                    <ul>
                        <Link to={'/cloud-vps'}><li style={{ borderBottom: '2px solid #3699ff' }}>
                            <TfiMenuAlt
                                size={15}
                                style={{
                                    verticalAlign: '-3px',
                                    marginRight: '8px',
                                    color: '#3699ff',
                                }}
                            />
                            <span>Danh sách cloud vps</span>
                        </li></Link>
                        <Link to={'/cloud-vps/deleted-cloud'}><li>
                            <TfiMenuAlt
                                size={15}
                                style={{
                                    verticalAlign: '-3px',
                                    marginRight: '8px',
                                    color: 'black',
                                }}
                            />
                            <span>Cloud Server đã bị xoá</span>
                        </li></Link>
                        <Link to={'/cloud-vps/about-to-expired'}><li>
                            <TfiMenuAlt
                                size={15}
                                style={{
                                    verticalAlign: '-3px',
                                    marginRight: '8px',
                                    color: 'black',
                                }}
                            />
                            <span>Cloud Server sắp hết hạn</span>
                        </li></Link>
                    </ul>
                </div>
                {optionCloud > 3 ? (
                    <CloudVPSDetail
                        data={cloudServerItem}
                    // updateLabelName={handleUpdateLabelName}
                    />
                ) : (
                    <>
                        <div className="cloud-vps-page-filter">
                            <div className="cloud-vps-page-filter-location">
                                <Select
                                    defaultValue=""
                                    style={{ width: 180 }}
                                    onChange={handleChangeLocation}
                                >
                                    <Option value="">Vị trí</Option>
                                    {location.map((item) => (
                                        <Option key={item._id} value={item._id}>
                                            {item.areaName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="cloud-vps-page-filter-os">
                                <Select
                                    defaultValue=""
                                    style={{ width: 180 }}
                                    onChange={handleChangeOs}
                                >
                                    <Option value="">Hệ điều hành</Option>
                                    {operatingSystem.map((item) => (
                                        <Option key={item._id} value={item._id}>
                                            {item.operatingSystemName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
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
                                    placeholder="Tên cloud vps"
                                />
                            </div>
                            <div className="cloud-vps-page-filter-submit">
                                <ButtonFilter buttonOnclick={onFilter} />
                            </div>
                        </div>
                        <div className="cloud-vps-page-table">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={cloudServer}
                                scroll={{ x: '1400px', y: '600px' }}
                                pagination={false}
                                sticky
                            />
                            <Pagination
                                showTotal={showTotal}
                                style={{ marginTop: '30px' }}
                                current={pageIndex}
                                total={totalItem}
                                pageSize={pageSize}
                                onChange={(value) => setPageIndex(value)}
                            />
                        </div>
                    </>
                )}
            </div>
        </React.Fragment>
    )
}

export default CloudVps
