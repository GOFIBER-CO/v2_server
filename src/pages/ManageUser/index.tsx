import '@/styles/pages/ManageIP/index.scss'
import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getIps } from '@/services/apis'
import { Input, Modal, Pagination, PaginationProps, Select, Tag, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { socket } from '@/layouts/MainLayout'
import formatDate from '@/helpers/formatDate'
import Ip from '@/interfaces/IIps'
import { IUser } from '@/interfaces/IUser'
import { addUserCredit, getPagingUser } from '@/services/apiv2'
import { FaMoneyBill } from 'react-icons/fa'
import formatMoney from '@/helpers/formatMoney'
import { notify, notifyType } from '@/App'

const { Option } = Select

const ManageUser = () => {
    const [idUserForUpdate, setIdUsetForUpdate] = useState('')
    const [modalUserCredit, setModalUserCredit] = useState(false)
    const [users, setUsers] = useState<IUser[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()
    const [statusFilter, setStatusFilter] = useState("")
    const [search, setSearch] = useState('')
    const [addMoney, setAddMoney] = useState(0)

    const layoutInit = useLayoutInit()
    
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getUser = async() => {
        try {
            layoutInit.setLoading(true)
            const result = await getPagingUser(pageSize, pageIndex, search)
            setUsers(result.data?.data.users)
            setTotalPage(result.data?.data.totalPage)
            setTotalItem(result.data?.data.totalDocs)
        } catch (error) {
            console.log(error)
        } finally{
            layoutInit.setLoading(false)
        }
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
    
    const clickAddMoney = (id: string) => {
        setIdUsetForUpdate(id)
        setModalUserCredit(true)
    }

    const handleAddMoney = async () => {
        try {
            const result = await addUserCredit(idUserForUpdate, addMoney)
            notify(notifyType.NOTIFY_SUCCESS, "Nạp tiền cho user thành công")
            setAddMoney(0)
            setModalUserCredit(false)
            getUser()
        } catch (error) {
            notify(notifyType.NOTIFY_ERROR, "Nạp tiền cho user thất bại")
            console.log(error)
        }
    }

    const columns: ColumnsType<IUser> = [
        {
            title: 'Mã người dùng',
            dataIndex: 'client_id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'firstname',
            render: (value, record) => (
                record.firstname + " " + record.lastname
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => (
                value
            )
        },
        {
            title: "Số dư",
            dataIndex: 'credit',
            render: (value) => formatMoney(value)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'verified',
            render: (value, record) => value ? <Tag color='green'>Đã xác thực</Tag> : <Tag color='red'>Chưa xác thực</Tag>
        },
        {
            key: 'id',
            title: 'Điều khiển',
            dataIndex: 'id',
            render: (value, record) => (
                <div>
                   
                    <span>
                        <Tooltip title="Nạp tiền">
                            <FaMoneyBill style={actionIconStyle('green')} onClick={() => clickAddMoney(value)}/>
                        </Tooltip>
                    </span>
                </div>
            ),
        },
    ]

    useEffect(() => {
        getUser()
    }, [pageIndex, pageSize])

    return (
        <div className="manage-ip-page">
            <Modal open={modalUserCredit} onOk={handleAddMoney} onCancel={()=>setModalUserCredit(false)} title="Nạp tiền cho người dùng">
                <label>Số tiền (VND): </label>
                <Input type='number' style={{width: '100%'}} onChange={(e)=>setAddMoney(Number(e.target.value))}/>
            </Modal>
            <div className="manage-ip-page-header">
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
                        <span>Quản lý người dùng</span>
                    </li>
                </ul>
            </div>
            <div className="manage-ip-page-filter">
                
                <div className="manage-ip-page-filter-button">
                    {/* <ButtonFilter buttonOnclick={onFiltered} /> */}
                </div>
            </div>
            <div className="manage-ticket-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={users}
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

export default ManageUser
