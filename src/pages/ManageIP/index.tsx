import '@/styles/pages/ManageIP/index.scss'
import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getIps } from '@/services/apis'
import { Input, Pagination, PaginationProps, Select, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { socket } from '@/layouts/MainLayout'
import formatDate from '@/helpers/formatDate'
import Ip from '@/interfaces/IIps'

const { Option } = Select

const ManageIp = () => {
    const [filter, setFilter] = useState<{ level: number; email: string }>({
        level: 0,
        email: '',
    })
    const [ips, setIps] = useState<Ip[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()
    const [statusFilter, setStatusFilter] = useState("")

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getPagingIp = async () => {
        try {
            layout.setLoading(true)
            const result = await getIps(
                pageSize,
                pageIndex,
                statusFilter,
            )
            setIps(result.data?.ip)
            setTotalPage(result.data?.totalPage)
            setTotalItem(result.data?.count)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const onFiltered = () => {
        getPagingIp()
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }
    const columns: ColumnsType<Ip> = [
        {
            title: 'Ip',
            dataIndex: 'ip',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (value, record) => (
                value ? 'Chưa hoạt động' : 'Đang hoạt động'
            )
        },
        {
            key: 'id',
            title: 'Điều khiển',
            dataIndex: 'control',
            render: (value, record) => (
                <div>
                    <span>
                        <Link to={`/manage-ticket/${record._id}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                </div>
            ),
        },
    ]

    useEffect(() => {
        getPagingIp()
    }, [pageIndex, pageSize])

    return (
        <div className="manage-ip-page">
            <div className="manage-ip-page-header">
                <ul>
                    <li>
                        <TfiMenuAlt
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                                color: '#3699ff',
                            }}
                        />
                        <span>Quản lý IP</span>
                    </li>
                </ul>
            </div>
            <div className="manage-ip-page-filter">
                <div className="manage-ip-page-filter-level">
                    <Select
                        defaultValue=""
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setStatusFilter(value)
                        }
                    >
                        <Option value={""}>Tất cả</Option>
                        <Option value={"false"}>Đang hoạt động</Option>
                        <Option value={"true"}>Chưa hoạt động</Option>
                    </Select>
                </div>
                <div className="manage-ip-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="manage-ticket-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={ips}
                    scroll={{ x: '1400px', y: '600px' }}
                    pagination={false}
                    rowKey="_id"
                />
                <Pagination
                showSizeChanger
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(value, pageSize) => {
                        setPageIndex(value)
                        setPageSize(pageSize)
                    }}
                />
            </div>
        </div>
    )
}

export default ManageIp
