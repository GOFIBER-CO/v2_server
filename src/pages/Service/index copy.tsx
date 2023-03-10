import {
    getPagingServices,
    getServiceDetailsByServices,
    getUserSurplus,
} from '@/services/apiv2'
import {
    Button,
    Checkbox,
    Divider,
    Input,
    Pagination,
    Select,
    Table,
    Tag,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import '@/styles/pages/Service/index.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { dataservice } from '@/helpers/dataservices'
import formatMoney from '@/helpers/formatMoney'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useAppSelector } from '@/redux'
import { renderTableSkeleton } from '@/helpers/funtions'
import { convertMBtoGB, skeletonList, subtractNow } from '@/helpers'
import { Icon } from '@iconify/react'
import moment from 'moment'
import 'moment/locale/vi'
import ConverMoney from '@/components/Conver/ConverMoney'
moment.locale('vi')

const imageTemplate = [
    {
        id: 1,
        value: 'windows',
        icon: 'openmoji:windows',
    },
    {
        id: 2,
        value: 'ubuntu',
        icon: 'openmoji:ubuntu',
    },
    {
        id: 3,
        value: 'centos',
        icon: 'logos:centos-icon',
    },
    {
        id: 4,
        value: 'debian',
        icon: 'logos:debian',
    },
    {
        id: 5,
        value: 'almalinux',
        icon: 'logos:linux-tux',
    },
]

function ServiceListPage() {
    const [tab, setTab] = useState<string>('Active')
    const [services, setServices] = useState<any[]>([])
    const [allServicesExtra, setAllServicesExtra] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [search, setSearch] = useState<string>('')
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [status, setStatus] = useState<string>('All')
    const navigate = useNavigate()
    const { allService, isLoading: isLoadingRedux } = useAppSelector(
        (state) => state.service
    )
    const [serviceDetails, setServiceDetails] = useState<any[]>([])

    const auth = useAuth()
    const clientId = auth.user?.client_id
    const [credit, setCredit] = useState(0)
    const [balance, setBalance] = useState(0)
    const [chosenIds, setChosenIds] = useState<string[]>([])

    // const getService = async () => {
    //     try {
    //         setIsLoading(true)

    //         const result = await getPagingServices(search, pageIndex, pageSize)

    //         const { data } = result?.data
    //         setData(data?.data || [])
    //         setAllServices(data?.data || [])
    //         setServices(data?.data?.slice(0, pageSize) || [])
    //         setPageIndex(data?.pageIndex || 0)
    //         setPageSize(data?.pageSize || 0)
    //     } catch (error) {
    //         console.log(error)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    // useEffect(() => {
    //     getService()
    // }, [])

    // useEffect(() => {
    //     setServices((prevState) => {
    //         const newState = allServices.slice(
    //             (pageIndex - 1) * pageSize,
    //             pageIndex * pageSize
    //         )

    //         return newState
    //     })
    // }, [pageIndex, pageSize, allServices])

    useEffect(() => {
        let temp = []
        if (tab === 'Active') {
            temp = allService?.filter((item) => item?.status === 'Active')
            setAllServicesExtra(temp || [])
            setServices(temp?.slice(0, pageSize) || [])
        } else if (tab === 'Terminated') {
            temp = allService?.filter((item) => item?.status === 'Terminated')
            setAllServicesExtra(temp || [])
            setServices(temp?.slice(0, pageSize) || [])
        } else {
            temp = allService.filter((item) => {
                const temp =
                    new Date(item?.next_due).getTime() - Date.now() <
                    7 * 24 * 60 * 60 * 1000

                return temp
            })

            setAllServicesExtra(temp || [])
            setServices(temp?.slice(0, pageSize) || [])
        }
    }, [allService, tab])

    const getServiceDetails = async (serviceIds: any[]) => {
        try {
            setIsLoading(true)
            const result = await getServiceDetailsByServices(serviceIds)

            const { data } = result?.data
            setServiceDetails(data || [])
        } catch (error) {
            console.log('getServiceDetails', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const serviceIds = services?.map((item) => item?.id) || []
        getServiceDetails(serviceIds)
    }, [services])

    const getSurplus = async () => {
        try {
            const result = await getUserSurplus()
            if (result.data) {
                setCredit(Number(result.data?.data?.details?.acc_credit || 0))
                setBalance(result.data?.data?.details?.acc_balance || 0)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSurplus()
    }, [])

    const genServiceDetail = (id: string) => {
        return serviceDetails?.find((item) => item?.service_id === id)
    }

    const genCycle = (value: string) => {
        return value === 'Annually'
            ? 'N??m'
            : value === 'Quarterly'
            ? '3 Th??ng'
            : value === 'Semi-Annually'
            ? '6 Th??ng'
            : 'Th??ng'
    }

    const disableCheckboxChooseItem = (item: any) => {
        return Date.now() < new Date(item?.next_due).getTime()
    }

    const handleChooseId = (value: string) => {
        setChosenIds((prevState: string[]) => {
            const temp = prevState.find((id) => id === value)

            if (temp) {
                return prevState?.filter((id) => id !== value)
            }

            return [...prevState, value]
        })
    }

    const columnsClientId22: ColumnsType<any> = [
        {
            title: 'IP',
            dataIndex: 'ip',
            render: (value, record) => (
                <>
                    <div className="extra">{value}</div>
                </>
            ),
        },
        {
            title: 'D???ch v???',
            dataIndex: 'object_id',
            render: (value, record) => (
                <>
                    <div className="primary">{record?.name}</div>
                    <div className="extra">
                        {record?.domain ? `(${record?.domain})` : ''}
                    </div>
                </>
            ),
        },
        // {
        //     title: 'Domain',
        //     dataIndex: 'domain',
        //     render: (value) => {
        //         return <div>{value || 'https://gofiber.vn'}</div>
        //     },
        // },
        {
            title: 'CPU',
            dataIndex: 'cpu',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'RAM',
            dataIndex: 'ram',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'SSD',
            dataIndex: 'ssd',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'OS',
            dataIndex: 'os',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'T???ng ti???n',
            dataIndex: 'price',
            render: (value) => {
                return <div>{formatMoney(value)}</div>
            },
        },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            render: (value, record) =>
                value === 'Active' ? (
                    <Tag color="green">??ang ho???t ?????ng</Tag>
                ) : value == 'Terminated' ? (
                    <Tag color="red">???? x??a</Tag>
                ) : (
                    <Tag color="red">Ch??a thanh to??n</Tag>
                ),
        },
        {
            title: 'Ghi ch??',
            dataIndex: 'note',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: '',
            dataIndex: 'id',
            width: '4%',
            render: (value) => (
                <div>
                    <button
                        onClick={() => {
                            navigate(`/service-detail-payment/${value}`)
                        }}
                        style={{
                            background: '#fff',
                            padding: '0px',
                            width: 'fit-content',
                            height: 'fit-content',
                            border: 'none',
                        }}
                    >
                        <FaCog
                            style={{
                                color: '#3891f2',
                                width: '18px',
                                height: '18px',
                            }}
                        />
                    </button>
                </div>
            ),
            onCell: (item) => {
                return {
                    onClick: () => {
                        // handleAddCloud(item)
                        // setCloudServerItem(item)
                    },
                }
            },
        },
    ]

    const columns: ColumnsType<any> = [
        {
            title: '',
            dataIndex: 'id',
            width: '50px',
            render: (value, record) => (
                <>
                    <Checkbox
                        value={value}
                        checked={Boolean(chosenIds?.find((id) => id === value))}
                        onChange={(e) => handleChooseId(e?.target?.value)}
                        disabled={disableCheckboxChooseItem(record)}
                    />
                </>
            ),
        },
        {
            title: 'D???ch v???',
            dataIndex: 'id',
            render: (value, record) => (
                <>
                    <div className="primary">{record?.name}</div>
                    <div className="extra">
                        {convertMBtoGB(genServiceDetail(value)?.memory || 0)}
                        GB RAM - {genServiceDetail(value)?.cpus || 0} CPUs -{' '}
                        {genServiceDetail(value)?.disk || 0}GB DISK
                    </div>
                </>
            ),
        },
        {
            title: 'Domain ',
            dataIndex: 'domain',
            render: (value) => {
                return (
                    <div
                        style={{
                            color: '#3891f2',
                            fontWeight: '500',
                            fontSize: '16px',
                        }}
                    >
                        {value}
                    </div>
                )
            },
        },
        {
            title: 'IPV4',
            dataIndex: 'id',
            render: (value) => {
                return (
                    <div
                        style={{
                            fontWeight: '500',
                            fontSize: '14px',
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <Icon
                                icon={'twemoji:flag-vietnam'}
                                style={{
                                    minWidth: '22px',
                                    height: '22px',
                                    marginRight: '4px',
                                }}
                            />
                            <span>
                                {genServiceDetail(value)?.ipv4
                                    ? genServiceDetail(value)?.ipv4
                                    : 'Ch??a c??'}
                            </span>
                        </div>
                        <div>Viettel - Vi???t Nam</div>
                    </div>
                )
            },
        },
        {
            title: 'H??H',
            dataIndex: 'id',
            width: '100px',
            render: (value: any) => {
                return (
                    <div>
                        {genServiceDetail(value)?.template_name ? (
                            <Icon
                                style={{ width: '32px', height: '32px' }}
                                icon={
                                    imageTemplate.find((item) =>
                                        genServiceDetail(value)
                                            ?.template_name?.toLowerCase()
                                            ?.includes(item?.value)
                                    )?.icon as string
                                }
                            />
                        ) : (
                            <div
                                style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                }}
                            >
                                Ch??a c??
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            title: <div style={{ textAlign: 'right' }}>H??A ????N</div>,
            dataIndex: 'total',
            render: (value: any, record) => {
                return (
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            textAlign: 'right',
                        }}
                    >
                        <div
                            style={{
                                color: '#3891f2',
                            }}
                        >
                            {ConverMoney(Number(value))} ??
                        </div>
                        <Divider className="m-0 p-0" />
                        <div>{genCycle(record?.billingcycle)}</div>
                    </div>
                )
            },
        },
        {
            title: 'Ng??y h???t h???n',
            dataIndex: 'next_due',
            render: (value: any, record: any, index: number) => {
                return (
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#5c5c5c',
                        }}
                    >
                        <div>{value}</div>
                        <div style={{ color: 'red' }}>{subtractNow(value)}</div>
                    </div>
                )
            },
        },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            width: '150px',
            render: (value, record) =>
                value === 'Active' ? (
                    <Tag color="green">??ang ho???t ?????ng</Tag>
                ) : value == 'Terminated' ? (
                    <Tag color="red">???? x??a</Tag>
                ) : (
                    <Tag color="blue">??ang ch???</Tag>
                ),
        },
        {
            title: '',
            dataIndex: 'id',
            width: '50px',
            render: (value) => (
                <div>
                    <button
                        onClick={() => {
                            navigate(`/service-detail-payment/${value}`)
                        }}
                        style={{
                            background: '#fff',
                            padding: '0px',
                            width: 'fit-content',
                            height: 'fit-content',
                            border: 'none',
                        }}
                    >
                        <FaCog
                            style={{
                                color: '#3891f2',
                                width: '18px',
                                height: '18px',
                            }}
                        />
                    </button>
                </div>
            ),
            onCell: (item) => {
                return {
                    onClick: () => {
                        // handleAddCloud(item)
                        // setCloudServerItem(item)
                    },
                }
            },
        },
    ]

    const handleSearch = () => {
        // if (!search && status === 'All') {
        //     setAllServices(data)
        //     setServices(data?.slice(0, pageSize) || [])
        // } else {
        //     const result = allServices?.filter((item) => {
        //         const text = search ? item?.domain?.includes(search) : true
        //         const sta = status !== 'All' ? item?.status === status : true
        //         return text && sta
        //     })
        //     setAllServices(result)
        //     setServices(result?.slice(0, pageSize) || [])
        //     setPageIndex(1)
        // }
    }

    const handleChooseTab = (value: string) => {
        setTab(value)
    }

    return (
        <div className="table-list-service">
            <div className="cloud-vps-page-option">
                <ul className="mb-4">
                    <li
                        onClick={() => handleChooseTab('Active')}
                        className={`${tab === 'Active' ? 'active' : ' '}`}
                    >
                        <TfiMenuAlt
                            size={15}
                            className="icon-tab"
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                            }}
                        />
                        <span>D???ch v??? ??ang ho???t ?????ng</span>
                    </li>
                    <li
                        onClick={() => handleChooseTab('Terminated')}
                        className={`${tab === 'Terminated' ? 'active' : ' '}`}
                    >
                        <TfiMenuAlt
                            className="icon-tab"
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                            }}
                        />
                        <span>D???ch v??? ???? x??a</span>
                    </li>
                    <li
                        onClick={() => handleChooseTab('Expires')}
                        className={`${tab === 'Expires' ? 'active' : ' '}`}
                    >
                        <TfiMenuAlt
                            className="icon-tab"
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                            }}
                        />
                        <span>D???ch v??? s???p h???t h???n</span>
                    </li>
                </ul>
            </div>
            <div className="row align-items-center mb-4">
                <div className="col col-12 col-md-3">
                    <Input
                        type="text"
                        style={{ width: '250px' }}
                        placeholder="Domain"
                        onChange={(e) => setSearch(e.target?.value)}
                    />
                </div>
                <div className="col col-12 col-md-3">
                    {/* <Select
                        defaultValue="All"
                        style={{ width: '200px', marginLeft: '5px' }}
                        options={[
                            { value: 'All', label: 'T???t c???' },
                            { value: 'Active', label: 'Ho???t ?????ng' },
                            { value: 'Terminated', label: '???? x??a' },
                        ]}
                        onChange={(e) => setStatus(e)}
                    /> */}

                    <Button
                        onClick={handleSearch}
                        style={{ marginLeft: '5px' }}
                        type="primary"
                    >
                        L???c
                    </Button>
                </div>
            </div>

            <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-wrap">
                    <div style={{ marginRight: '12px' }} className="money-item">
                        <div className="extra">H??a ????n ?????n h???n</div>
                        <div
                            style={{ fontSize: '18px', fontWeight: '500' }}
                            className="money red"
                        >
                            {ConverMoney(balance) || 0} ??
                        </div>
                    </div>
                    <div className="money-item">
                        <div className="extra">T??n d???ng</div>

                        <div
                            style={{ fontSize: '18px', fontWeight: '500' }}
                            className="money green"
                        >
                            {ConverMoney(credit) || 0} ??
                        </div>
                    </div>
                </div>
                {chosenIds?.length > 0 && (
                    <Button type="primary">Thanh to??n h??a ????n</Button>
                )}
            </div>

            <Table
                columns={
                    Number(clientId) == 22
                        ? columnsClientId22
                        : isLoading
                        ? renderTableSkeleton(skeleton)
                        : columns
                }
                dataSource={
                    Number(clientId) == 22
                        ? columnsClientId22
                        : isLoading
                        ? skeletonList
                        : services
                }
                scroll={{ x: '1200px', y: '720px' }}
                loading={isLoadingRedux}
                pagination={false}
                sticky
                rowKey="_id"
            />
            {Number(clientId) !== 22 && (
                <div className="d-flex align-items-center mt-4">
                    <Pagination
                        current={pageIndex}
                        total={allServicesExtra?.length}
                        defaultCurrent={pageIndex}
                        pageSize={pageSize}
                        onChange={(value, pageSize) => {
                            setServices((prevState) => {
                                const newState = allServicesExtra.slice(
                                    (value - 1) * pageSize,
                                    value * pageSize
                                )

                                return newState
                            })
                            setPageIndex(value)
                            setPageSize(pageSize)
                        }}
                    />
                    <div
                        style={{
                            marginLeft: '12px',
                            fontWeight: '500',
                            fontSize: '15px',
                        }}
                    >
                        T???ng: {allServicesExtra?.length || 0} d???ch v???
                    </div>
                </div>
            )}
        </div>
    )
}

export default ServiceListPage

const skeleton = [
    {
        title: '',
        type: 'input',
        width: 50,
    },
    {
        title: 'D???CH V???',
        type: 'input',
        width: 100,
    },
    {
        title: 'DOMAIN',
        type: 'input',
        width: 100,
    },
    {
        title: 'IPV4',
        type: 'input',
        width: 100,
    },
    {
        title: 'H??H',
        type: 'input',
        width: 100,
    },
    {
        title: 'H??A ????N',
        type: 'input',
        width: 100,
    },
    {
        title: 'NG??Y H???T H???N',
        type: 'input',
        width: 100,
    },
    {
        title: 'TR???NG TH??I',
        type: 'input',
        width: 100,
    },
]
