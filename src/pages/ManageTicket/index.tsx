import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getTickets } from '@/services/apis'
import '@/styles/pages/ManageTicket/index.scss'
import { Input, Pagination, PaginationProps, Select, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { render } from 'react-dom'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { socket } from '@/layouts/MainLayout'
import { notify, notifyType } from '@/App'
import formatDate from '@/helpers/formatDate'
import { getpagingClientTicketViettel, getpagingSupport } from '@/services/apiv2'

const { Option } = Select

const ManageTicket = () => {
    const [filter, setFilter] = useState<{ level: string; email: string }>({
        level: "" ,
        email: '',
    })
    const [tickets, setTickets] = useState<ITicket[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getAllTickets = async () => {
        try {
            layout.setLoading(true)
            const result = await getpagingSupport(
                pageIndex,  
                pageSize,
        filter.email || "",
        filter.level || ""
            )
            setTickets(result?.data?.data)
            setTotalPage(result.data?.totalPages)
            setTotalItem(result.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const onFiltered = () => {
        getAllTickets()
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
    const columns: ColumnsType<ITicket> = [
        // {
        //     title: 'Mã ticket',
        //     dataIndex: 'ticket_number',
        // },
        {
            title: 'Tiêu đề',
            dataIndex: 'subject',
            // render: (value) => value?.title,
        },
        {
            title: 'Cấp độ ưu tiên',
            dataIndex: 'level',
            render: (value) =>
                value == 1 ? (
                    <Tag color="green">Bình Thường</Tag>
                ) : value == 2 ? (
                    <Tag color="yellow">Ưu Tiên</Tag>
                ) : (
                    <Tag color="red">Khẩn Cấp</Tag>
                ),
        },
        {
            title: 'Phòng ban',
            dataIndex: 'dept_id',
            render: (value) => value?.name,
        },
        // {
        //     title: 'Người dùng ',
        //     dataIndex: 'name',
        // },
        // {
        //     title: 'Loại yêu cầu',
        //     dataIndex: 'request_type',
        //     render: (value) =>
        //         value == 1 ? (
        //             <Tag color="green">Bình Thường</Tag>
        //         ) : value == 2 ? (
        //             <Tag color="yellow">Ưu Tiên</Tag>
        //         ) : (
        //             <Tag color="red">Khẩn Cấp</Tag>
        //         ),
        // },
        // {
        //     title: 'Deptname',
        //     dataIndex: 'deptname',
        //     // render: (value) => value?.email,
        // },
       
        // {
        //     title: 'Type',
        //     dataIndex: 'type',
        //     render: (value) => value?.email,
        // },
        {
            title: 'File',
            dataIndex: 'file',
            render: (value) => (
                <a
                    target={'_blank'}
                    href={`${appConfig.API_URL_UPLOAD_FILES}/${value}`}
                >
                    {value}
                </a>
            ),
        },
        // {
        //     title: 'Ngày Tạo',
        //     dataIndex: 'createdTime',
        //     render: (value) => formatDate(value),
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) =>
                value == '1' ? (
                    <Tag color="green">Đã giải quyết</Tag>
                    
                ) : value == '2' ? (
                    <Tag color="orange">Đang chờ giải quyết</Tag>
                ) : (
                    <Tag color="red">Chưa xác nhận</Tag>
                ),
        },
        {
            key: 'id',
            title: 'Điều khiển',
            dataIndex: 'control',
            render: (value, record) => 
            (
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
        getAllTickets()
    }, [pageIndex, pageSize])

    useEffect(() => {
        socket.on('new ticket is sent', (msg) => {
            setTickets((state) => [msg, ...state])
        })
    }, [])
    return (
        <div className="manage-ticket-page">
            <div className="manage-ticket-page-header">
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
                        <span>Quản lý ticket </span>
                    </li>
                </ul>
            </div>
            <div className="manage-ticket-page-filter">
                <div className="manage-ticket-page-filter-level">
                    <Select
                        defaultValue="Tất cả"
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setFilter({ ...filter, level:value })
                        }
                    >
                        <Option value="">Tất cả</Option>
                        <Option value="1">Bình thường</Option>
                        <Option value="2">Ưu tiên</Option>
                        <Option value="3">Khẩn cấp</Option>
                    </Select>
                </div>
                <div
                    className="manage-ticket-page-filter-email"
                    style={{ marginLeft: '10px', marginRight: '10px' }}
                >
                    <Input
                        type="text"
                        placeholder="Email người dùng..."
                        onChange={(e) =>
                            setFilter({ ...filter, email: e.target.value })
                        }
                    />
                </div>
                <div className="manage-ticket-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="manage-ticket-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tickets}
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

export default ManageTicket
