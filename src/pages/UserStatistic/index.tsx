import ButtonFilter from '@/components/ButtonFilter'
import formatMoney from '@/helpers/formatMoney'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IUserStatistic from '@/interfaces/IUserStatistic'
import { getUserStatistic } from '@/services/apiv2'
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
    const [filterTable, setfilterTable] = useState(null)

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
            const result = await getUserStatistic(pageIndex, filter, pageSize)
        
            setStatistics(result.data?.data)
            // setPageSize(result.data?.pageSize)
            // setTotalItem(result.data?.totalItem)
            // setPageIndex(Number(result.data?.pageIndex))
            // setTotalPage(result.data?.totalPages)
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
        // {
        //     title: 'Mã khách hàng',
        //     // dataIndex: 'code',
        // },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name',
        },
        // {
        //     title: 'Tổng tiền đã nạp',
        //     dataIndex: 'invoice_paid',
        //     render:(_,record,index)=>{
        //         console.log(record, 'â');

        //         const sum: number = Number(record?.credit) + Number(record?.invoice_paid)
        //         return <>{sum}</>
        //     }
        //     // sorter: (a, b) => a.numberOfPricePurchase - b.numberOfPricePurchase,
        // },
        {
            title: 'Tổng tiền đã dùng',
            dataIndex: 'invoice_paid',
            render: (value) => (formatMoney(value)),
            // sorter: (a, b) => Number(a.priceUsed) - Number(b.priceUsed),
        },
        {
            title: 'Số cloud vps đã mua',
            dataIndex: 'service',
        },
        {
            title: 'Số ticket đã gửi',
            dataIndex: 'count_ticket',
        },
        {
            title: 'Số ticket đã được giải quyết',
            dataIndex: 'soTicket',
            render:(value,record)=>{
                const data : any = []
                value?.map((item : any) => {
                    if(item === 3 ){
                        return data.push(item)
                    }
                })
                return <>{data.length}</>
            }
        },
    ]

    const onFiltered = () => {
        // getStatistic()
        // Search();
    }

    useEffect(() => {
        getStatistic()
    }, [pageIndex, pageSize])

    
    const Search = (value: any) => {

        const filterTable = statistics.filter((o: any) =>
            Object.keys(o).some(k =>
              String(o[k])
                .toLowerCase()
                .includes(value.toLowerCase())
            )
          );
               
            setfilterTable(filterTable as any)    
    }

    
    
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
                        style={{width:'300px'}}
                        type="text"
                        placeholder="Tên người dùng..."
                        onChange={(e: any)=>Search(e.target.value)}
                    />
                </div>
                {/* <div className="user-statistic-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div> */}
            </div>
            <div className="user-statistic-page-table">
                <Table
                    columns={columns}
                    dataSource={filterTable == null ? statistics : filterTable}
                    scroll={{ x: '1350px', y: '400px' }}
                    // pagination={false}
                    rowSelection={rowSelection}
                />
                {/* <Pagination
                    showSizeChanger    
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={Number(pageIndex)}
                    total={totalItem}
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                        setPageIndex(page)
                        setPageSize(pageSize)
                    }}
                /> */}
            </div>
        </div>
    )
}

export default UserStatistic
