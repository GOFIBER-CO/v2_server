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
    Modal,
    Pagination,
    Select,
    Table,
    Tag,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState, useCallback } from 'react'
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
import ConverMoney from '@/components/Conver/ConverMoney'
import ModalPayment from '@/components/ModalPayment'
import config from '@/config/appConfig'

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
    const [selectedService, setSelectedService] = useState<number[]>([])
    const navigate = useNavigate()
    const { allService, isLoading: isLoadingRedux } = useAppSelector(
        (state) => state.service
    )

    const { allInvoice } = useAppSelector((state) => state.invoice)
    const [serviceDetails, setServiceDetails] = useState<any[]>([])
    const [modalPayment, setModalPayment] = useState(false)

    const auth = useAuth()
    const clientId = auth.user?.client_id
    const [credit, setCredit] = useState(0)
    const [balance, setBalance] = useState(0)
    const [chosenIds, setChosenIds] = useState<any[]>([])
    const [modal, setModal] = useState<{
        visible: boolean
        data: any[]
    }>({
        visible: false,
        data: [],
    })

    const linux = ['Centos 7']
    const window = ['Windows Server 2019']

    const handleSelectService = (id: number, value: boolean) => {
        if (value) {
            setSelectedService([...selectedService, id])
        } else {
            setSelectedService([...selectedService.filter((x) => x != id)])
        }
    }

    const handleSelectAllService = (value: boolean) => {
        if (value) {
            setSelectedService(dataservice.map((item) => item.id))
        } else {
            setSelectedService([])
        }
    }

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

    const filterDataServiceByTab = () => {
        if (tab === 'Active') {
            return dataservice.filter((item) => item.activeStatus == 'active')
        } else if (tab === 'Terminated') {
            return dataservice.filter(
                (item) => item.activeStatus == 'terminated'
            )
        } else {
            return dataservice.filter((item) => {
                const temp =
                    new Date(item?.expireDate).getTime() - Date.now() <
                    7 * 24 * 60 * 60 * 1000

                return temp
            })
        }
    }

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
        //check invoice has 1 item and unpaid
        const temp1 = allInvoice.filter((invoice: any) => {
            return invoice?.items?.length === 1 && invoice?.status === 'Unpaid'
        })

        // check item exist in invoices
        const temp2 = temp1.find((invoice: any) => {
            return invoice?.items?.find((e: any) => e?.item_id === item?.id)
        })
        console.log('temp', temp2)
        if (!temp2) return true

        return false
        // return Date.now() < new Date(item?.next_due).getTime()
    }

    // const disableCheckboxChooseItem = useCallback((item: any) => {
    //     return checkCheckboxChooseItem(item)
    // }, [])

    const handleChooseId = (value: string) => {
        setChosenIds((prevState: string[]) => {
            const temp = prevState.find((id) => id === value)

            if (temp) {
                return prevState?.filter((id) => id !== value)
            }

            return [...prevState, value]
        })
    }

    // select all of Th---g
    const handleSelectAllServicesId = (e: any) => {
        const idsInCurrentPage = services?.map((item: any) => item?.id)

        if (e) {
            setChosenIds(
                Array.from(new Set([...chosenIds, ...idsInCurrentPage]))
            )
        } else {
            setChosenIds((prevState: string[]) => {
                const temp: string[] = []
                prevState?.forEach((id: string) => {
                    if (!idsInCurrentPage?.includes(id)) temp.push(id)
                })
                return temp
            })
        }
    }

    const isCheckedAll = () => {
        const idsInCurrentPage = services?.map((item: any) => item?.id)
        if (idsInCurrentPage?.length === 0) return false
        let result = true

        idsInCurrentPage?.forEach((id: string) => {
            if (!chosenIds?.includes(id)) {
                result = false
            }
        })

        return result
    }

    const columnsClientId22: ColumnsType<any> = [
        {
            title: (
                <Checkbox
                    checked={selectedService.length == dataservice.length}
                    onChange={(e) => handleSelectAllService(e.target.checked)}
                />
            ),
            dataIndex: 'id',
            width: '4%',
            render: (value) => (
                <Checkbox
                    checked={selectedService.includes(value)}
                    onChange={(e) =>
                        handleSelectService(value, e.target.checked)
                    }
                />
            ),
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            render: (value, record) => (
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
                        <span>{value}</span>
                    </div>
                    <div>Viettel - Vi???t Nam</div>
                </div>
            ),
        },
        {
            title: 'D???ch v???',
            dataIndex: 'object_id',
            width: '12%',
            render: (value, record) => (
                <>
                    <div className="primary">{record?.ssd}GB SSD</div>
                    <div className="extra">
                        {record?.ram}GB RAM - {record?.cpu} cpus
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
            width: '4%',
            dataIndex: 'cpu',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'RAM',
            width: '4%',
            dataIndex: 'ram',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'SSD',
            dataIndex: 'ssd',
            width: '4%',
            render: (value) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'OS',
            dataIndex: 'os',
            width: '4%',
            render: (value) => {
                return (
                    <div>
                        {linux.includes(value) ? (
                            <img width={28} src="/images/icon-centos.svg" />
                        ) : (
                            <img width={28} src="/images/icon-windows.svg" />
                        )}
                    </div>
                )
            },
        },
        {
            title: 'T???ng ti???n',
            dataIndex: 'price',
            render: (value) => {
                return (
                    <div className="bold-text extra">{formatMoney(value)}</div>
                )
            },
        },
        {
            title: 'Ng??y h???t h???n',
            dataIndex: 'expireDate',
            render: (value: any, record: any, index: number) => {
                return (
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#5c5c5c',
                        }}
                    >
                        <div>
                            {moment(new Date(value)).format('DD/MM/YYYY')}
                        </div>
                        <div style={{ color: 'red' }}>{subtractNow(value)}</div>
                    </div>
                )
            },
        },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            render: (value, record) =>
                value === 'Paid' ? (
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
            title: (
                <Checkbox
                    checked={Boolean(isCheckedAll())}
                    onChange={(e) =>
                        handleSelectAllServicesId(e.target.checked)
                    }
                />
            ),
            dataIndex: 'id',
            width: '50px',
            render: (value, record) => (
                <>
                    <Checkbox
                        value={value}
                        checked={Boolean(chosenIds?.find((id) => id === value))}
                        onChange={(e) => handleChooseId(e?.target?.value)}
                        // disabled={disableCheckboxChooseItem(record)}
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

        if (search) {
            const result = allServicesExtra.filter((item) => {
                return item?.domain?.includes(search)
            })

            setAllServicesExtra(result)
            setServices(result?.slice(0, pageSize))
        } else {
            let temp = []
            if (tab === 'Active') {
                temp = allService?.filter((item) => item?.status === 'Active')
                setAllServicesExtra(temp || [])
                setServices(temp?.slice(0, pageSize) || [])
            } else if (tab === 'Terminated') {
                temp = allService?.filter(
                    (item) => item?.status === 'Terminated'
                )
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
        }

        setPageIndex(1)
    }

    const handleChooseTab = (value: string) => {
        setTab(value)
    }

    const getPriceModalPayment = () => {
        let price = 0
        selectedService.forEach((item) => {
            const service = dataservice.find((x) => x.id == item)
            if (service) price += service.price
        })
        return formatMoney(price)
    }

    const handlePayment = () => {
        const result: any[] = []

        // check item exist in invoices
        allInvoice?.forEach((item: any) => {
            const temp = item?.items?.find((e: any) => {
                return chosenIds?.includes(e?.item_id)
            })

            if (temp && !result?.find((e: any) => e?.id === temp?.id)) {
                result.push(temp)
            }
        })
        console.log(result)
        setModal({
            data: result,
            visible: true,
        })
    }

    const genDataModal = (
        data: any[]
    ): { amount: number; invoices: string } => {
        let amount = 0
        let invoices = ''

        data?.forEach((item: any, index: number) => {
            amount += Number(item?.linetotal) || 0
            invoices += `GOF${item?.invoice_id}${
                index < data?.length - 1 ? ',' : ''
            } `
        })

        return {
            amount,
            invoices,
        }
    }

    return (
        <div className="table-list-service">
            <ModalPayment
                isShow={modalPayment}
                setModal={setModalPayment}
                price={getPriceModalPayment()}
            />
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
                        style={{ width: '100%' }}
                        placeholder="Nh???p th??ng tin t??m ki???m"
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
                        title="L???c"
                    >
                        L???c
                    </Button>

                    {Number(clientId) == 22 && selectedService.length > 0 && (
                        <Button
                            onClick={() => setModalPayment(true)}
                            className="button-payment"
                            type="primary"
                            style={{ marginLeft: '8px' }}
                        >
                            Thanh to??n
                        </Button>
                    )}
                </div>
            </div>

            {Number(auth.user?.client_id) != 22 && (
                <div className="mb-3 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-wrap">
                        <div
                            style={{ marginRight: '12px' }}
                            className="money-item"
                        >
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
                        <Button onClick={handlePayment} type="primary">
                            Thanh to??n d???ch v??? ???? ch???n
                        </Button>
                    )}
                </div>
            )}

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
                        ? filterDataServiceByTab()
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
            <Modal
                title="Thanh to??n d???ch v???"
                open={modal?.visible}
                width={700}
                footer={null}
                onCancel={() =>
                    setModal((prevState) => ({
                        ...prevState,
                        visible: false,
                    }))
                }
            >
                <div className="row align-items-center">
                    <div className="col col-12 col-lg-6">
                        <img
                            src={`https://manager.idcviettel.com/vietqr.php?account=${
                                config.BANK_ACCOUNT
                            }&bankcode=${config.BANK_CODE}&amount=${
                                genDataModal(modal?.data).amount
                            }&noidung=${genDataModal(modal?.data).invoices}`}
                            style={{
                                height: '200px',
                                maxWidth: '200px',
                                minWidth: '200px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                    <div className="col col-12 col-lg-6">
                        <div
                            className=""
                            style={{ fontWeight: '400', fontSize: '18px' }}
                        >
                            <div>S??? t??i kho???n: {config?.BANK_ACCOUNT}</div>
                            <div>Ch??? t??i kho???n: Nguy???n Trung Hi???u</div>
                            <div>
                                N???i dung thanh to??n:{' '}
                                {genDataModal(modal?.data).invoices}
                            </div>
                            <div>
                                S??? ti???n:{' '}
                                {ConverMoney(
                                    Number(genDataModal(modal?.data).amount) ||
                                        0
                                )}
                                ??
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-center" style={{ fontSize: '18px' }}>
                    <i>
                        Qu?? kh??ch vui l??ng ??i???n ????ng s??? ho?? ????n v?? s??? ti???n ho???c
                        qu??t m?? QR ????? thanh to??n.
                    </i>
                </div>
            </Modal>
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
