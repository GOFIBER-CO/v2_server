import { Pagination, PaginationProps, Table, Tag } from 'antd'
import React, { CSSProperties, useEffect, useState } from 'react'
import { ColumnsType } from 'antd/lib/table'
import ISnapshots from '@/interfaces/ISnapshots'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ILog from '@/interfaces/ILog'
import formatDate from '@/helpers/formatDate'
import ICloudServer from '@/interfaces/ICloudServer'
import { getLogByUserId } from '@/services/apis'
const Log = ({
    data,
    dataCloudServer,
    totalPageValue,
    pageSizeValue,
    totalItemValue,
}: {
    data?: ILog[]
    dataCloudServer?: ICloudServer
    totalPageValue: number
    pageSizeValue: number
    totalItemValue: number
}) => {
    const layout = useLayoutInit()
    console.log(data)
    const [log, setLog] = useState(data)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(totalPageValue)
    const [pageSize, setPageSize] = useState(pageSizeValue)
    const [totalItem, setTotalItem] = useState(totalItemValue)
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const columns: ColumnsType<ISnapshots> = [
        {
            title: 'ĐỐI TƯỢNG',
            dataIndex: 'cloudServer',
            render: (value) => value.cloudServerName,
        },
        {
            title: 'THAO TÁC',
            dataIndex: 'content',
        },
        {
            title: 'TRẠNG THÁI ',
            dataIndex: 'status',
            render: (value) =>
                value ? (
                    <Tag color="green">Thành công</Tag>
                ) : (
                    <Tag color="red">Không thành công</Tag>
                ),
        },
        {
            title: 'THỜI GIAN THỰC HIỆN',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            title: 'THỜI GIAN HOÀN THÀNH',
            dataIndex: 'completionTime',
            render: (value) => formatDate(value),
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

    const getLog = async () => {
        try {
            layout.setLoading(true)
            const log = await getLogByUserId(
                dataCloudServer?.user,
                dataCloudServer?._id,
                pageIndex
            )

            setLog(log.data?.data)
            setTotalPage(log.data?.totalPages)
            setPageSize(log.data?.pageSize)
            setTotalItem(log.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getLog()
    }, [pageIndex])

    return (
        <>
            <div>
                <div className="cloud-vps-page-table">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={log}
                        scroll={{ x: '1300px', y: '600px' }}
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

export default Log
