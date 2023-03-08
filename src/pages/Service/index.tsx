import { getPagingServices } from '@/services/apiv2'
import { Pagination, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import '@/styles/pages/Service/index.scss'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { dataservice } from '@/helpers/dataservices'

function ServiceListPage() {
    const [services, setServices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [search, setSearch] = useState<string>('')
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const navigate = useNavigate()

    const auth = useAuth()
    const clientId = auth.user?.client_id

 
    const getService = async () => {
        try {
            setIsLoading(true)

            const result = await getPagingServices(search, pageIndex, pageSize)

            const { data } = result?.data
            setServices(data?.data || [])
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
    }, [pageIndex, pageSize])

    const columnsClientId22: ColumnsType<any> = [
        {
            title: 'IP',
            dataIndex: 'ip',
            render: (value, record) => (
                <>
                    <div className="extra">
                       {value}
                    </div>
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
        },   {
            title: 'Tổng tiền',
            dataIndex: 'price',
            render: (value) => {
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
                    >
                        <FaCog
                            style={{
                                color: 'gray',
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
            title: 'Domain',
            dataIndex: 'domain',
            render: (value) => {
                return <div style={{ color: '#3891f2' }}>{value}</div>
            },
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

    return (
        <div className="table-list-service">
            <Table
                columns={Number(clientId) == 22 ? columnsClientId22 : columns}
                dataSource={Number(clientId) == 22 ? dataservice : services}
                scroll={{ x: '1200px', y: '720px' }}
                pagination={false}
                sticky
                rowKey="_id"
            />
            {/* <Pagination
                showSizeChanger
                // showTotal={showTotal}
                style={{ marginTop: '30px' }}
                current={pageIndex}
                defaultCurrent={pageIndex}
                // total={totalItem}
                pageSize={pageSize}
                onChange={(value, pageSize) => {
                    setPageIndex(value)
                    setPageSize(pageSize)
                }}
            /> */}
        </div>
    )
}

export default ServiceListPage
