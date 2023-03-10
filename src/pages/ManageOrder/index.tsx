import ButtonFilter from '@/components/ButtonFilter'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IOrder from '@/interfaces/IOrder'
import { getOrders } from '@/services/apis'
import { Input, Pagination, PaginationProps, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import '@/styles/pages/ManageOrder/index.scss'
import formatDate from '@/helpers/formatDate'
import formatMoney from '@/helpers/formatMoney'
import reverseDate from '@/helpers/reverseDate'
import { DatePicker } from 'antd'
import moment from 'moment'
import { getOrdersViettell } from '@/services/apiv2'

const { RangePicker } = DatePicker

const ManageOrder = () => {
    const [filter, setFilter] = useState<{
        name: string
        timeFrom: string
        timeTo: string
    }>({
        timeFrom: '',
        name: '',
        timeTo: '',
    })
    const [order, setOrder] = useState<IOrder[]>([])
    const [pageSize, setPageSize] = useState(10)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalItem, setTotalItem] = useState(1)

    const layout = useLayoutInit()

    
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const columns: ColumnsType<IOrder> = [
        // {
        //     title: 'Mã đơn hàng',
        //     dataIndex: 'client_id',
        // },
        {
            title: 'Tên khách hàng',
            dataIndex: 'firstname',
            
        },
        {
            title: 'Tên ngân hàng',
            dataIndex: 'module',
            // render: (value) => value?.serverName,
        },
        {
            title: 'Giá',
            dataIndex: 'total',
            render: (value) => formatMoney(value),
            // sorter: (a, b) => Number(a.totalPrice) - Number(b.totalPrice),
        },
        // {
        //     title: 'Ngày mua',
        //     dataIndex: 'createdAt',
        //     render: (value) => formatDate(value),
        //     sorter: (a, b) =>
        //         new Date(reverseDate(formatDate(a.createdAt))).getTime() -
        //         new Date(reverseDate(formatDate(b.createdAt))).getTime(),
        // },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render:(value : any) => {
                if(value === 'Pending'){
                    return  <Tag color="orange">Đang chờ</Tag>
                }
                if(value === 'Active'){
                    return  <Tag color="green">Xác nhận</Tag>
                }
            }
        },
    ]

    const handleChangeTimeFilter = (value: string[]) => {
        setFilter((filter) => ({ ...filter, timeFrom: value[0] }))
        setFilter((filter) => ({ ...filter, timeTo: value[1] }))
    }

    const onFiltered = () => {
        getOrder()
    }

    const getOrder = async () => {
        try {
            layout.setLoading(true)
            const result = await getOrdersViettell(
                pageIndex,
                filter.name,
                pageSize
            )
            
            setOrder(result.data?.data)
            setTotalItem(result.data?.totalItem)
            setTotalPage(result.data?.totalPages)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getOrder()
    }, [pageIndex, pageSize])

    return (
        <div className="manage-order-page">
            <div className="manage-order-page-header">
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
                        <span>Thống kê đơn hàng</span>
                    </li>
                </ul>
            </div>
            <div className="manage-order-page-filter">
                <div
                    className="manage-order-page-filter-name"
                    style={{ marginLeft: '10px', marginRight: '10px' }}
                >
                    <Input
                        type="text"
                        placeholder="Tên người dùng..."
                        onChange={(e) =>
                            setFilter({ ...filter, name: e.target.value })
                        }
                    />
                </div>
                {/* <div
                    className="manage-order-page-filter-time"
                    style={{ marginRight: '10px' }}
                >
                    <RangePicker
                        onChange={(date, dateString) =>
                            handleChangeTimeFilter(dateString)
                        }
                    />
                </div> */}
                <div className="manage-order-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="manage-order-page-table">
                <Table
                    columns={columns}
                    dataSource={order}
                    scroll={{ x: '1000px', y: '600px' }}
                    pagination={false}
                />
                <Pagination
                showSizeChanger
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={Number(pageIndex)}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(value, pageSize) => {
                        setPageIndex(Number(value))
                        setPageSize(pageSize)
                    }}
                />
            </div>
        </div>
    )
}

export default ManageOrder
