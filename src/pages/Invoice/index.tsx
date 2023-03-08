import React, { useEffect, useState } from 'react'
import '@/styles/pages/Invoice/index.scss'
import { getAllInvoices, getUserSurplus } from '@/services/apiv2'
import { Table, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Link, useNavigate } from 'react-router-dom'
import ConverMoney from '@/components/Conver/ConverMoney'
import { HiArrowSmRight } from 'react-icons/hi'
import moment from 'moment'
import { useAuth } from '@/hooks/useAuth'
import { dataservice } from '@/helpers/dataservices'

function InvoicePage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const [credit, setCredit] = useState(0)
    const [balance, setBalance] = useState(0)

    const auth = useAuth()

    const getInvoices = async () => {
        try {
            setIsLoading(true)
            const result = await getAllInvoices()

            const { data } = result?.data

            setInvoices(data || [])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getInvoices()
        getSurplus()
    }, [])

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

    const columnsClientId22: ColumnsType<any> = [
        {
            title: 'Số hóa đơn',
            dataIndex: 'bill',
            render: (value) => (
                <div>
                    <Link to={'/'}>#{value?.number}</Link>
                </div>
            ),
        },
        {
            title: 'Tổng',
            dataIndex: 'price',
            render: (value) => {
                return <div>{ConverMoney(Number(value)) || 0}đ</div>
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'bill',
            render: (value) => {
                return <div>{moment(value?.createdAt).format("DD-MM-YYYY")}</div>
            },
        },
        {
            title: 'Ngày đến hạn',
            dataIndex: 'bill',
            render: (value) => {
                return <div>{moment(value?.expireDate).format("DD-MM-YYYY")}</div>
            },
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'bill',
            render: (value) => {
                return (
                    <div>{value === '0000-00-00 00:00:00' ? '-' : moment(value?.datePaid).format("DD-MM-YYYY")}</div>
                )
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            // width: '10%',
            render: (value, record) =>
                value === 'Paid' ? (
                    <Tag color="green">Đã thanh toán</Tag>
                ) : (
                    <Tag color="red">Chưa thanh toán</Tag>
                ),
        },
        {
            title: '',
            dataIndex: 'object_id',
            width: '10%',
            render: (value, record) => (
                <div className="d-flex justify-content-end">
                    {/* <button
                        onClick={() => {
                            navigate(`/invoice-detail/${value}`)
                        }}
                    >
                        <HiArrowSmRight
                            style={{ width: '24px', height: '24px' }}
                        />
                    </button> */}
                </div>
            ),
        },
    ]

    const columns: ColumnsType<any> = [
        {
            title: 'Số hóa đơn',
            dataIndex: 'number',
            render: (value) => (
                <div>
                    <Link to={'/'}>#{value}</Link>
                </div>
            ),
        },
        {
            title: 'Tổng',
            dataIndex: 'total',
            render: (value) => {
                return <div>{ConverMoney(Number(value)) || 0}đ</div>
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'date',
            render: (value: string) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'Ngày đến hạn',
            dataIndex: 'duedate',
            render: (value: string) => {
                return <div>{value}</div>
            },
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'datepaid',
            render: (value: string) => {
                return (
                    <div>{value === '0000-00-00 00:00:00' ? '-' : value}</div>
                )
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            // width: '10%',
            render: (value, record) =>
                value === 'Paid' ? (
                    <Tag color="green">Đã thanh toán</Tag>
                ) : (
                    <Tag color="red">Chưa thanh toán</Tag>
                ),
        },
        {
            title: '',
            dataIndex: 'object_id',
            width: '10%',
            render: (value, record) => (
                <div className="d-flex justify-content-end">
                    <button
                        onClick={() => {
                            navigate(`/invoice-detail/${value}`)
                        }}
                    >
                        <HiArrowSmRight
                            style={{ width: '24px', height: '24px' }}
                        />
                    </button>
                </div>
            ),
        },
    ]

    return (
        <div className="invoice-page">
            <div className="d-flex align-items-center justify-content-between mx-1 my-1">
                <div className="title">Hóa đơn</div>
                <div className="d-flex align-items-center">
                    <div style={{ marginRight: '12px' }} className="money-item">
                        <div className="money red">
                            {ConverMoney(balance) || 0} đ
                        </div>
                        <div className="extra">Hóa đơn đến hạn</div>
                    </div>
                    <div className="money-item">
                        <div className="money green">
                            {ConverMoney(credit) || 0} đ
                        </div>
                        <div className="extra">Tín dụng</div>
                    </div>
                </div>
            </div>
            <div className="table-invoices">
                <Table
                    columns={Number(auth.user?.client_id) == 22 ? columnsClientId22 : columns}
                    dataSource={Number(auth.user?.client_id) == 22 ? dataservice : invoices}
                    pagination={false}
                    sticky
                    scroll={{ x: '1200px', y: '600px' }}
                    rowKey="number"
                />
            </div>
        </div>
    )
}

export default InvoicePage
