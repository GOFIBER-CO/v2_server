import { getPagingServices } from '@/services/apiv2'
import { Button, Input, Pagination, Select, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import '@/styles/pages/Service/index.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { dataservice } from '@/helpers/dataservices'
import formatMoney from '@/helpers/formatMoney'

function ServiceListPage() {
    const [services, setServices] = useState<any[]>([])
    const [allServices, setAllServices] = useState<any[]>([])
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [search, setSearch] = useState<string>('')
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [status, setStatus] = useState<string>('All')
    const navigate = useNavigate()

    const auth = useAuth()
    const clientId = auth.user?.client_id

    const getService = async () => {
        try {
            setIsLoading(true)

            const result = await getPagingServices(search, pageIndex, pageSize)

            const { data } = result?.data
            setData(data?.data || [])
            setAllServices(data?.data || [])
            setServices(data?.data?.slice(0, pageSize) || [])
            setPageIndex(data?.pageIndex || 0)
            setPageSize(data?.pageSize || 0)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getService()
    }, [])

    // useEffect(() => {
    //     setServices((prevState) => {
    //         const newState = allServices.slice(
    //             (pageIndex - 1) * pageSize,
    //             pageIndex * pageSize
    //         )

    //         return newState
    //     })
    // }, [pageIndex, pageSize, allServices])

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
            title: 'Dịch vụ',
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
            title: 'Tổng tiền',
            dataIndex: 'price',
            render: (value) => {
                return <div>{formatMoney(value)}</div>
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value, record) =>
                value === 'Active' ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : value == 'Terminated' ? (
                    <Tag color="red">Đã xóa</Tag>
                ) : (
                    <Tag color="red">Chưa thanh toán</Tag>
                ),
        },
        {
            title: 'Ghi chú',
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
            title: 'Dịch vụ',
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
        {
            title: 'Domain ',
            dataIndex: 'domain',
            render: (value) => {
                return <div style={{ color: '#3891f2' }}>{value}</div>
            },
        },
        {
            title: 'Ipaddress ',
            dataIndex: 'ipaddress',
            // render: (value) => {
            //     return <div style={{ color: '#3891f2' }}>{value}</div>
            // },
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'next_due',
            render: (value: any, record: any, index: number) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value, record) =>
                value === 'Active' ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : value == 'Terminated' ? (
                    <Tag color="red">Đã xóa</Tag>
                ) : (
                    <Tag color="blue">Đang chờ</Tag>
                ),
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

    const handleSearch = () => {
        if (!search && status === 'All') {
            setAllServices(data)
            setServices(data?.slice(0, pageSize) || [])
        } else {
            const result = allServices?.filter((item) => {
                const text = search ? item?.domain?.includes(search) : true
                const sta = status !== 'All' ? item?.status === status : true

                return text && sta
            })
            setAllServices(result)
            setServices(result?.slice(0, pageSize) || [])
            setPageIndex(1)
        }
    }

    return (
        <div className="table-list-service">
            <div className="d-flex align-items-center mb-4">
                <div>
                    <Input
                        type="text"
                        style={{ width: '300px' }}
                        placeholder="Domain"
                        onChange={(e) => setSearch(e.target?.value)}
                    />
                </div>
                <Select
                    defaultValue="All"
                    style={{ width: '200px', marginLeft: '5px' }}
                    options={[
                        { value: 'All', label: 'Tất cả' },
                        { value: 'Active', label: 'Hoạt động' },
                        { value: 'Terminated', label: 'Đã xóa' },
                    ]}
                    onChange={(e) => setStatus(e)}
                />

                <Button
                    onClick={handleSearch}
                    style={{ marginLeft: '5px' }}
                    type="primary"
                >
                    Lọc
                </Button>
            </div>
            <Table
                columns={Number(clientId) == 22 ? columnsClientId22 : columns}
                dataSource={Number(clientId) == 22 ? dataservice : services}
                scroll={{ x: '1200px', y: '720px' }}
                loading={isLoading}
                pagination={false}
                sticky
                rowKey="_id"
            />
            {Number(clientId) !== 22 && (
                <Pagination
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    total={allServices?.length}
                    defaultCurrent={pageIndex}
                    pageSize={pageSize}
                    onChange={(value, pageSize) => {
                        setServices((prevState) => {
                            const newState = allServices.slice(
                                (value - 1) * pageSize,
                                value * pageSize
                            )

                            return newState
                        })
                        setPageIndex(value)
                        setPageSize(pageSize)
                    }}
                />
            )}
        </div>
    )
}

export default ServiceListPage
