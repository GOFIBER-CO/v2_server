import ButtonFilter from '@/components/ButtonFilter'
import '@/styles/pages/ActionHistory/ActionHistory.scss'
import { AutoComplete, Input, Pagination, PaginationProps, Select, Tag } from 'antd'
import { TfiMenuAlt } from 'react-icons/tfi'
import Table, { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import IUser from '@/interfaces/IUser'
import { getActionHistoryByUserId } from '@/services/apis'
import { useAuth } from '@/hooks/useAuth'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'

const { Option } = Select

interface Action{
    _id: string,
    action: string,
    user: string | IUser
    createdAt: string,
    successAt?: string,
}

const ActionHistory: React.FC = () => {
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`
    const [actions, setActions] = useState([])
    const [pageSize, setPageSize] = useState(6)
    const [pageIndex, setPageIndex] = useState(1)
    const [totalDoc, setTotalDoc] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const auth = useAuth()
    const layout = useLayoutInit()

    
    const getActionsHistory = async () => {
        try {
            layout.setLoading(true)
            const actions = await getActionHistoryByUserId(auth.user._id,pageSize, pageIndex)
            setActions(actions.data?.actions)
            setTotalDoc(actions.data?.totalDoc)
            setTotalPage(actions.data?.totalPage)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }
    interface DataType {
        key: React.Key
        name: string
        age: number
        address: string
    }

    const statusKey: {[key: string]: string} = {
        'pending': 'Đang thực hiện',
        'success': 'Thành công',
        'fail': 'Thất bại'
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Người thực hiện',
            dataIndex: 'user',
            render: (value) => value?.userName
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value:string) => {
                if(value === 'pending'){
                    return <Tag color="yellow">{statusKey[value]}</Tag>
                }else if(value === 'success'){
                    return <Tag color="success">{statusKey[value]}</Tag>
                }else{
                    return <Tag color="red">{statusKey[value]}</Tag>
                }
            }
            
        },
        {
            title: 'Thời gian thực hiện',
            dataIndex: 'createdAt',
            render: (value) => formatDate(value)
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'successAt',
            render: (value) => !value ? 'Chưa hoàn thành' : formatDate(value)
        },
    ]
    const onFiltered = () => {
        console.log('Filtered')
    }

    useEffect(()=>{
        getActionsHistory()
    },[pageIndex, pageSize])

    return (
        <div className="action-history-page">
            <div className="action-history-page-header">
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
                        <span>Lịch sử thao tác</span>
                    </li>
                </ul>
            </div>
            <div className="action-history-page-filter">
                <div className="action-history-page-filter-general">
                    <Input
                        type="text"
                        placeholder="Từ khóa.."
                        onChange={(e) => {}}
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
                    dataSource={actions}
                    rowKey="_id"
                />
                <Pagination
                    showTotal={showTotal}
                    style={{ marginTop: '30px' }}
                    current={pageIndex}
                    defaultCurrent={pageIndex}
                    total={totalDoc}
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

export default ActionHistory
