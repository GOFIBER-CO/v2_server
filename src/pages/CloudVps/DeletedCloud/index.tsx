
//@ts-nocheck
import '@/styles/pages/CloudVps/CloudVps.scss'
import { useEffect, useState } from 'react'
import { Input, PaginationProps, Select, Tag, Switch } from 'antd'
import ButtonFilter from '@/components/ButtonFilter'
import { ColumnsType } from 'antd/lib/table'
import { Table } from 'antd'
import { Pagination } from 'antd'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { getDeletedCloudServer, getLocations, getOs } from '@/services/apis'
import ICloudServer from '@/interfaces/ICloudServer'
import { useAuth } from '@/hooks/useAuth'
import formatDate from '@/helpers/formatDate'
import IArea from '@/interfaces/IArea'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import CloudVPSDetail from '@/components/CloudVPS/CloudVPSDetail/CloudVPSDetail'
import { ListMenuCloud } from '@/interfaces/DataDefault/ListMenuCloud'
import MenuCloud from '@/components/CloudVPS/MenuCloud'
import IMenuCloud from '@/interfaces/IMenuCloud'
import IOrder from '@/interfaces/IOrder'
import subtractDate from '@/helpers/subtractDate'
import { Link } from 'react-router-dom'
import { TfiMenuAlt } from 'react-icons/tfi'
const { Option } = Select

const DeletedCloud: React.FC = () => {
    const [filter, setFilter] = useState<{
        location: string
        operatingSystem: string
        name: string
    }>({
        location: '',
        operatingSystem: '',
        name: '',
    })

    const [listMenuCloud, setListMenuCloud] = useState(ListMenuCloud)
    const [cloudServer, setCloudServer] = useState<ICloudServer[]>([])
    const [cloudServerItem, setCloudServerItem] = useState<ICloudServer>()
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [location, setLocation] = useState<IArea[]>([])
    const [operatingSystem, setOperatingSystem] = useState<
        IOparatingSystemArray[]
    >([])
    const [optionCloud, setOptionCloud] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const auth = useAuth()

    const columns: ColumnsType<ICloudServer> = [
        {
            title: 'M?? server',
            dataIndex: 'code',
            width: '8.5%',
        },
        {
            title: 'T??n d???ch v???',
            dataIndex: 'server',
            render: (value) => (
                <div>
                    <a className="server_title">{value.serverName}</a>
                    <div>
                        {value.ram}GB | {value.cpu}vCPUs | {value.ssd}GB NVMe
                    </div>
                </div>
            ),
            width: '18%',

            onCell: (item) => {
                return {
                    onClick: () => {
                        setOptionCloud(listMenuCloud.length)
                    },
                }
            },
        },
        {
            title: '?????a ch??? IP',
            dataIndex: ['server', 'area'],
            width: '15%',
            render: (value, row) => (
                <>
                    <img
                        src={`${row.area?.file}`}
                        style={{ maxWidth: '25px', maxHeight: '25px' }}
                    />
                    <strong style={{ fontSize: '12px' }}>
                        {' '}
                        {row.server.ipv4}
                    </strong>
                    <br />
                    <span>{row.area?.areaName}</span>
                </>
            ),
        },
        {
            title: 'H??H',
            dataIndex: 'operatingSystem',
            width: '5%',
            render: (value) => (
                <>
                    <img
                        src={value?.img}
                        style={{ maxWidth: '25px', maxHeight: '25px' }}
                    />
                </>
            ),
        },
        {
            title: 'Ho?? ????n',
            dataIndex: ['order', 'server'],
            render: (value, row) => (
                <strong>
                    {row?.order?.totalPrice ? (
                        <>
                            <div className="order_price">
                                {Intl.NumberFormat('en-US', {
                                    maximumFractionDigits: 0,
                                }).format(Number(row.order.totalPrice))}
                                <small style={{}}>???</small>
                            </div>
                            <span className="unit-price">
                                {row.server.expiryDateType === 1 ? (
                                    <>Gi???</>
                                ) : row.server.expiryDateType === 2 ? (
                                    <>Ng??y</>
                                ) : row.server.expiryDateType === 3 ? (
                                    <>Th??ng</>
                                ) : row.server.expiryDateType === 4 ? (
                                    <>3 Th??ng</>
                                ) : row.server.expiryDateType === 5 ? (
                                    <>6 Th??ng</>
                                ) : row.server.expiryDateType === 6 ? (
                                    <>N??m</>
                                ) : null}
                            </span>
                        </>
                    ) : null}
                </strong>
            ),
            width: '7.5%',
        },
        {
            title: 'Ng??y h???t h???n',
            dataIndex: 'expiryDate',
            render: (value) => (
                <>
                    <span>{formatDate(value)}</span>
                    <span style={{ color: 'red', display: 'block' }}>
                        {subtractDate(new Date(value), new Date()) / 30 >= 1
                            ? `${Math.ceil(
                                  subtractDate(new Date(value), new Date()) / 30
                              )} th??ng t???i`
                            : `${subtractDate(
                                  new Date(value),
                                  new Date()
                              )} ng??y t???i`}{' '}
                    </span>
                </>
            ),
        },
        {
            title: 'GHT??',
            dataIndex: 'isAutoRenew',
            render: (value, record) => (
                <>
                    <Switch disabled checked={value} size="small" />
                </>
            ),
            width: '6%',
        },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'updatedAt',
            render: (value) =>
                value ? (
                    <Tag color="green">Ho???t ?????ng</Tag>
                ) : (
                    <Tag color="red">Ng??ng</Tag>
                ),
        },
        {
            title: 'Nh??n d???ch v???',
            dataIndex: 'cloudServerName',
        },
    ]

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const handleChangeGeneralFilter = (value: string) => {
        console.log(`selected ${value}`)
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
            const cloudVps = await getDeletedCloudServer(
                auth.user._id,
                filter.location,
                filter.operatingSystem,
                filter.name,
                pageIndex,
                pageSize
            )
            // console.log(cloudVps)
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

    useEffect(() => {
        getCloudServer()
        getAllLocation()
        // getAllOrder()
        getOperatingSystem()
    }, [pageIndex, pageSize])

    return (
        <div className="cloud-vps-page">
            <div className="cloud-vps-page-option">
                <ul>
                    <Link to={'/cloud-vps'}>
                        <li>
                            <TfiMenuAlt
                                size={15}
                                style={{
                                    verticalAlign: '-3px',
                                    marginRight: '8px',
                                    color: 'black',
                                }}
                            />
                            <span>Danh s??ch cloud vps</span>
                        </li>
                    </Link>
                    <Link to={'/cloud-vps/deleted-cloud'}>
                        <li style={{ borderBottom: '2px solid #3699ff' }}>
                            <TfiMenuAlt
                                size={15}
                                style={{
                                    verticalAlign: '-3px',
                                    marginRight: '8px',
                                    color: '#3699ff',
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
                <CloudVPSDetail data={cloudServerItem} />
            ) : (
                <>
                    <div className="cloud-vps-page-filter">
                        {/* <div className="cloud-vps-page-filter-general">
                        <Input.Group compact style={{ width: '350px' }}>
                            <Select defaultValue="Sign Up" style={{ width: '30%' }}>
                                <Option value="Sign Up">Sign Up</Option>
                                <Option value="Sign In">Sign In</Option>
                            </Select>
                            <AutoComplete
                                style={{ width: '70%' }}
                                placeholder="Email"
                                options={[{ value: 'text 1' }, { value: 'text 2' }]}
                            />
                        </Input.Group>
                    </div> */}
                        <div className="cloud-vps-page-filter-location">
                            <Select
                                defaultValue=""
                                style={{ width: 180 }}
                                onChange={handleChangeLocation}
                            >
                                <Option value="">T???t c???</Option>
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
                                <Option value="">T???t c???</Option>
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
                                placeholder="T??n cloud vps"
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
                            scroll={{ x: '1000px', y: '600px' }}
                            pagination={false}
                            sticky
                        />
                        <Pagination
                        showSizeChanger 
                            showTotal={showTotal}
                            style={{ marginTop: '30px' }}
                            current={pageIndex}
                            total={totalItem}
                            pageSize={pageSize}
                            onChange={(page, pageSize) => {
                                setPageIndex(page)
                                setPageSize(pageSize)
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default DeletedCloud
