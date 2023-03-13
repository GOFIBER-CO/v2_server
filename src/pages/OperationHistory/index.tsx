import ButtonFilter from '@/components/ButtonFilter'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { getOperationHistory } from '@/services/apiv2'
import '@/styles/pages/ActionHistory/ActionHistory.scss'
import { Input, Pagination, PaginationProps, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { useState, useEffect } from 'react'
import { FaHistory } from 'react-icons/fa'

const OperationHistory = () => {
    const showTotal: PaginationProps['showTotal'] = (totalItem) =>
        `Total ${totalItem} items`
    const layout = useLayoutInit()
    const [filter, setFilter] = useState('')
    const [operation, setOperation] = useState([])
    const [pageSize, setPageSize] = useState(10)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const getDataHistory = async () => {
        try {
            layout.setLoading(true)
            const operation = await getOperationHistory(
                pageSize,
                pageIndex,
                filter
            )
            setOperation(operation.data.data.actions)
            setTotalPage(operation.data?.data.totalPage)
            setTotalItem(operation.data?.data.totalDocs)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }
    useEffect(() => {
        getDataHistory()
    }, [pageIndex, pageSize])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
    // console.log(filter ,'filter');
    const statusKey: { [key: string]: string } = {
        pending: 'Đang thực hiện',
        success: 'Thành công',
        fail: 'Thất bại',
    }

    interface DataType {
        key: React.Key
        name: string
        age: number
        address: string
    }
    const columns: ColumnsType<DataType> = [
        {
            title: 'Người thực hiện',
            dataIndex: 'user',
            render: (value,record, index) => {
               
                const name = `${value?.lastname} ${value?.firstname}`
                return <>{name}</>
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: string) => {
                if (value === 'pending') {
                    return <Tag color="yellow">Đang chờ</Tag>
                } else if (value === 'success') {
                    return <Tag color="success">Thành công</Tag>
                } else {
                    return <Tag color="red">Thất bại</Tag>
                }
            },
        },
        {
            title:"IP",
            dataIndex: "IP"
        },
        // {
        //     title:"FP",
        //     dataIndex: "FP",
        //     render:(value) => (
        //         <>{value?.hash}</>
        //     )
        // },
        {
            title: 'Thời gian thực hiện',
            dataIndex: 'createdAt',
            render: (value) => formatDate(value),
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'successAt',
            render: (value) => (!value ? 'Chưa hoàn thành' : formatDate(value)),
        },
    ]
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const onFiltered = () => {
        getDataHistory()
    }
    return (
        <div className="action-history-page">
            <div className="action-history-page-header">
                <ul>
                    <li>
                        <FaHistory
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                                color: '#3699ff',
                            }}
                        />
                        <span>Lịch sử thao tác </span>
                    </li>
                </ul>
            </div>
            <div className="action-history-page-filter">
                <div className="action-history-page-filter-general">
                    <Input
                        type="text"
                        placeholder="Từ khóa.."
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="action-history-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="action-history-page-table">
                <Table
                    columns={columns}
                    scroll={{ x: '1000px', y: '600px' }}
                    pagination={false}
                    dataSource={operation}
                    rowSelection={rowSelection}
                />
                <Pagination
                    showSizeChanger
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    defaultCurrent={pageIndex}
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

export default OperationHistory
