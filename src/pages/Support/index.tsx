import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import formatDate from '@/helpers/formatDate'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getSupportByUserId } from '@/services/apis'
import '@/styles/pages/SupportPage/Support.scss'
import {
    AutoComplete,
    Button,
    Input,
    Pagination,
    PaginationProps,
    Select,
    Tag,
} from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

import "./Support.css"


const { Option } = Select

const Support: React.FC = () => {
    const auth = useAuth()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
    const [tickets, setTickes] = useState<ITicket[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [filter, setFilter] = useState<{
        SupportTT: string
        SupportUT: string
        supportName: string
    }>({ SupportTT: '',SupportUT:'', supportName: '' })
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const layout = useLayoutInit()
    useEffect(() => {
        getAllTickets()
    }, [pageIndex, pageSize])

    const getAllTickets = async () => {
        try {
            layout.setLoading(true)
            const result = await getSupportByUserId(auth.user._id, pageIndex, filter.SupportTT, filter.SupportUT, filter.supportName
                , pageSize
                )
            setTickes(result.data?.data)
            setTotalPage(result.data?.totalPages)
            setTotalItem(result.data?.totalItem)
            
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const columns: ColumnsType<ITicket> = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'code',
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
            dataIndex: 'processingRoom',
            render: (value) => value?.processingRoomName,
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'user',
            render: (value) => value?._id,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            render: (value) => value?.title,
        },
        {
            title: 'File đính kèm',
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
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value) =>
                value == 0 ? (
                    <Tag color="red">Chưa xác nhận</Tag>
                ) : value == 1 ? (
                    <Tag color="orange">Đang chờ giải quyết</Tag>
                ) : (
                    <Tag color="green">Đã giải quyết</Tag>
                ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
    ]

    const onFiltered = () => {
        getAllTickets()
    }

    
    return (
        <div className="support-page">
            <div className="support-page-header">
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
                        <span>Danh sách ticket</span>
                    </li>
                </ul>
            </div>
            <div className="support-page-filter">
                <div className="support-page-create-ticket">
                    <Link to={'/support/create-ticket'}>
                        <Button type="primary">Tạo ticket</Button>
                    </Link>
                </div>
                <div className="support-page-create-ticket" style={{marginLeft:'10px'}}>
                <Select
                    defaultValue="--Trạng thái--"
                    style={{ width: 130 , }}
                    onChange={(value) =>
                        setFilter({
                            ...filter,
                            SupportTT: value,
                        })
                    }
                >
                    <Option value={0}>Chưa xác nhận</Option>
                    <Option value={1}>Xác nhận</Option>
                    <Option value={2}>Hoàn thành</Option>
                </Select>
                </div>
                <div className="support-page-create-ticket" style={{marginLeft:'10px'}}>
                <Select
                    defaultValue="--Cấp ưu tiên--"
                    style={{ width: 140 , }}
                    onChange={(value) =>
                        setFilter({
                            ...filter,
                            SupportUT: value,
                        })
                    }                   
                    options={[
                        {
                            value: 0,
                            label: 'Tất cả',
                        },
                        {
                            value: 1,
                            label: 'Bình thường',
                        },
                        {
                            value: 2,
                            label: 'Ưu tiên',
                        },
                        {
                            value: 3,
                            label: 'Khẩn cấp',
                        },
                       
                    ]}
                    />
                </div>
                
                <div className="support-page-create-ticket" style={{marginLeft:'10px'}} >
                <Input 
                     onChange={(e) =>
                        setFilter({
                            ...filter,
                            supportName: e.target.value,
                        })
                    }
                />
                </div>

                <div className="support-page-create-ticket" style={{marginLeft:'10px'}}>
                    <ButtonFilter buttonOnclick={onFiltered}></ButtonFilter>
                </div>
                <div className="support-page-filter-general"></div>
                {/* <div className="support-page-filter-submit">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div> */}
            </div>
            <div className="support-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tickets}
                    scroll={{ x: '1300px', y: '600px' }}
                    pagination={false}
                />
                <Pagination
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(value, pageSize) => {
                        setPageIndex(value)
                        setPageSize(pageSize)
                    }
                    }
                />
            </div>
        </div>
    )
}

export default Support
