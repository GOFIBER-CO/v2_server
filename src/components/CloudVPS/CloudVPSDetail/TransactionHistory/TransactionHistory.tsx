//@ts-nocheck
import { Pagination, PaginationProps, Table } from 'antd'
import React, { CSSProperties, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import ISnapshots from '@/interfaces/ISnapshots'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITransactionHistory from '@/interfaces/ITransactionHistory'
import ICloudServer from '@/interfaces/ICloudServer'
import { getTransactionHistoryByCloudId } from '@/services/apis'
import formatDate from '@/helpers/formatDate'
import formatMoney from '@/helpers/formatMoney'

const TransactionHistory = ({
    dataCloudServer,
    dataTransactionHistory,
    totalPageValue,
    pageSizeValue,
    totalItemValue,
}: {
    dataCloudServer?: ICloudServer
    dataTransactionHistory?: ITransactionHistory[]
    totalPageValue: number
    pageSizeValue: number
    totalItemValue: number
}) => {
    const layout = useLayoutInit()
  
    const [transactionHistory, setTransactionHistory] = useState(
        dataTransactionHistory
    )
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(totalPageValue)
    const [pageSize, setPageSize] = useState(pageSizeValue)
    const [totalItem, setTotalItem] = useState(totalItemValue)
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const columns: ColumnsType<ISnapshots> = [
        {
            title: 'MÃ GIAO DỊCH',
            dataIndex: 'code',
        },
        {
            title: 'NỘI DUNG',
            dataIndex: 'content',
        },
        {
            title: 'THỜI GIAN',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            title: 'SỐ DƯ TRƯỚC GIAO DỊCH',
            dataIndex: 'balanceBeforeTransaction',
            render: (value) => formatMoney(value),
        },
        {
            title: 'SỐ TIỀN	',
            dataIndex: 'price',
            render: (value) => formatMoney(value),
        },
        {
            title: 'SỐ DƯ SAU GIAO DỊCH',
            dataIndex: 'balanceAfterTransaction',
            render: (value) => formatMoney(value),
        },
    ]

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const getPaymentHistory = async () => {
        try {
            layout.setLoading(true)
            const transactionHistory = await getTransactionHistoryByCloudId(
                dataCloudServer?.user,
                dataCloudServer?._id,
                pageIndex
            )

            setTransactionHistory(transactionHistory.data?.data)
            setTotalPage(transactionHistory.data?.totalPages)
            setPageSize(transactionHistory.data?.pageSize)
            setTotalItem(transactionHistory.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getPaymentHistory()
    }, [pageIndex])

    return (
        <>
            <div>
                <div className="cloud-vps-page-table">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={transactionHistory}
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
        </>
    )
}

export default TransactionHistory
