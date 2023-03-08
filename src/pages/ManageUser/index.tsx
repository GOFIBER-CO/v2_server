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
import { IUser } from '@/interfaces/IUser'
import { getPagingUser } from '@/services/apiv2'

const { Option } = Select

const ManageUser = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()
    const [statusFilter, setStatusFilter] = useState("")
    const [search, setSearch] = useState('')

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getUser = async() => {
        try {
            const result = await getPagingUser(pageSize, pageIndex, search)
            console.log(result.data)
            setUsers(result.data?.data.users)
            setTotalPage(result.data?.data.totalPage)
            setTotalItem(result.data?.data.totalDocs)
        } catch (error) {
            console.log(error)
        }
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
    const columns: ColumnsType<IUser> = [
        {
            title: 'Mã người dùng',
            dataIndex: 'client_id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'firstname',
            render: (value, record) => (
                record.firstname + " " + record.lastname
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => (
                value
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'verified',
            render: (value, record) => value ? <Tag color='green'>Đã xác thực</Tag> : <Tag color='red'>Chưa xác thực</Tag>
        },
        {
            key: 'id',
            title: 'Điều khiển',
            dataIndex: 'control',
            render: (value, record) => (
                <div>
                    <span>
                        <Link to={`/manage-users/${record._id}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                </div>
            ),
        },
    ]

    useEffect(() => {
        getUser()
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
                        <span>Quản lý người dùng</span>
                    </li>
                </ul>
            </div>
            <div className="manage-ip-page-filter">
                
                <div className="manage-ip-page-filter-button">
                    {/* <ButtonFilter buttonOnclick={onFiltered} /> */}
                </div>
            </div>
            <div className="manage-ticket-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={users}
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

export default ManageUser
