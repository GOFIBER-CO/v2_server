import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import INotification from '@/interfaces/INotification'
import { getAllNotification } from '@/services/apis'
import '@/styles/pages/Notification/index.scss'
import { Button, Input, Pagination, PaginationProps } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

const Notification = () => {
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [filter, setFilter] = useState('')

    const layout = useLayoutInit()

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const getNotifications = async () => {
        try {
            layout.setLoading(true)
            const result = await getAllNotification(pageIndex, filter)
            setNotifications(result.data?.data)
            setTotalPage(result.data?.totalPage)
            setPageIndex(result.data?.pageIndex)
            setPageSize(result.data?.pageSize)
            setTotalItem(result.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            layout.setLoading(false)
            console.log(error)
        }
    }

    const onFiltered = () => {
        getNotifications()
    }

    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }
    const columns: ColumnsType<INotification> = [
        {
            title: 'Mã thông báo',
            dataIndex: 'code',
        },
        {
            title: 'Tên thông báo',
            dataIndex: 'name',
        },
        {
            title: 'Loại thông báo',
            dataIndex: 'type',
        },
        {
            title: 'Người gửi',
            dataIndex: 'sender',
            render: (value) => value?.email,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            title: 'Chi tiết',
            dataIndex: 'slug',
            render: (value, record) => (
                <div>
                    <span>
                        <Link to={`/notification/${value}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                </div>
            ),
        },
    ]

    useEffect(() => {
        getNotifications()
    }, [pageIndex])

    return (
        <div className="manage-notification-page">
            <div className="manage-notification-page-header">
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
                        <span>Quản lý thông báo</span>
                    </li>
                </ul>
            </div>
            <div className="manage-notification-page-filter">
                <div
                    className="manage-notification-page-create-notification"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/notification/create-notification'}>
                        <Button type="primary">Tạo thông báo</Button>
                    </Link>
                </div>
                <div
                    className="manage-notification-page-filter-name"
                    style={{
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginTop: '20px',
                    }}
                >
                    <Input
                        type="text"
                        placeholder="Tên thông báo..."
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
                <div
                    className="manage-ticket-page-filter-button"
                    style={{ marginTop: '20px' }}
                >
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="manage-notification-page-table">
                <Table
                    columns={columns}
                    dataSource={notifications}
                    scroll={{ x: '1000px', y: '600px' }}
                    pagination={false}
                />
                <Pagination
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(value) => setPageIndex(value)}
                />
            </div>
        </div>
    )
}

export default Notification
