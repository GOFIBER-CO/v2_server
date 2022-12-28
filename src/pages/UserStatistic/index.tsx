import ButtonFilter from '@/components/ButtonFilter'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IUserStatistic from '@/interfaces/IUserStatistic'
import { getUserStatistic } from '@/services/apis'
import '@/styles/pages/UserStatistic/index.scss'
import { Input, Pagination, PaginationProps } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'

const UserStatistic = () => {
    const [filter, setFilter] = useState('')
    const [statistics, setStatistics] = useState<IUserStatistic[]>([])
    const [pageSize, setPageSize] = useState(1)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalItem, setTotalItem] = useState(1)

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getStatistic = async () => {
        try {
            layout.setLoading(true)
            const result = await getUserStatistic(pageIndex, filter)
            setStatistics(result.data?.statistic)
            setPageSize(result.data?.pageSize)
            setTotalItem(result.data?.totalItem)
            setPageIndex(Number(result.data?.pageIndex))
            setTotalPage(result.data?.totalPages)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const columns: ColumnsType<IUserStatistic> = [
        {
            title: 'Mã khách hàng',
            dataIndex: 'code',
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'userName',
        },
        {
            title: 'Tổng tiền đã nạp',
            dataIndex: 'numberOfPricePurchase',
            sorter: (a, b) => a.numberOfPricePurchase - b.numberOfPricePurchase,
        },
        {
            title: 'Tổng tiền đã dùng',
            dataIndex: 'priceUsed',
            render: (value) => value.sum,
            sorter: (a, b) => Number(a.priceUsed) - Number(b.priceUsed),
        },
        {
            title: 'Số cloud vps đã mua',
            dataIndex: 'numberOfCloudVps',
        },
        {
            title: 'Số ticket đã gửi',
            dataIndex: 'numberOfTicketSent',
        },
        {
            title: 'Số ticket đã được giải quyết',
            dataIndex: 'numberOfTicketSolved',
        },
    ]

    const onFiltered = () => {
        getStatistic()
    }

    useEffect(() => {
        getStatistic()
    }, [pageIndex])
    return (
        <div className="user-statistic-page">
            <div className="user-statistic-page-header">
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
                        <span>Thống kê người dùng</span>
                    </li>
                </ul>
            </div>
            <div className="user-statistic-page-filter">
                <div
                    className="user-statistic-page-filter-name"
                    style={{ marginLeft: '10px', marginRight: '10px' }}
                >
                    <Input
                        type="text"
                        placeholder="Tên người dùng..."
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="user-statistic-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="user-statistic-page-table">
                <Table
                    columns={columns}
                    dataSource={statistics}
                    scroll={{ x: '1350px', y: '400px' }}
                    pagination={false}
                />
                <Pagination
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={Number(pageIndex)}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(value) => setPageIndex(Number(value))}
                />
            </div>
        </div>
    )
}

export default UserStatistic
