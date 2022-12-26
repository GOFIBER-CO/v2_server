import { useLayoutInit } from '@/hooks/useInitLayOut'
import IDepartment from '@/interfaces/IDepartment'
import { getAllDepartment } from '@/services/apis'
import '@/styles/pages/Location/index.scss'
import { Button, Input, Pagination, PaginationProps, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import ButtonFilter from '@/components/ButtonFilter'

const Department = () => {
    const [filter, setFilter] = useState('')
    const [department, setDepartment] = useState<IDepartment[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const layout = useLayoutInit()
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
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

    const columns: ColumnsType<IDepartment> = [
        {
            title: 'Mã phòng ban',
            dataIndex: 'code',
        },
        {
            title: 'Tên phòng ban',
            dataIndex: 'processingRoomName',
        },
        {
            title: 'Điều khiển',
            dataIndex: 'control',
            render: (_, record) => (
                <div>
                    <Link to={`/department/edit-department/${record._id}`}>
                        <span>
                            <BiEdit style={actionIconStyle('blue')} />
                        </span>
                    </Link>

                    <Link to={`/department/delete-department/${record._id}`}>
                        <span>
                            <AiOutlineDelete style={actionIconStyle('red')} />
                        </span>
                    </Link>
                </div>
            ),
        },
    ]

    const getDepartments = async () => {
        try {
            layout.setLoading(true)
            const department = await getAllDepartment(pageIndex, filter)
            setDepartment(department.data?.data)
            setTotalPage(department.data?.totalPages)
            setPageSize(department.data?.pageSize)
            setTotalItem(department.data?.totalItem)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const onFilter = () => {
        getDepartments()
    }

    useEffect(() => {
        getDepartments()
    }, [pageIndex])
    return (
        <div className="cloud-vps-page">
            <div className="cloud-vps-page-header">
                <ul style={{ paddingLeft: '0px' }}>
                    <li
                        style={{
                            listStyle: 'none',
                            borderBottom: '2px solid #3699ff',
                            display: 'inline-block',
                            padding: '5px 8px',
                        }}
                    >
                        <TfiMenuAlt
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                                color: '#3699ff',
                            }}
                        />
                        <span>Phòng ban</span>
                    </li>
                </ul>
            </div>
            <div className="cloud-vps-page-filter">
                <div
                    className="department-page-create-department"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/department/create-department'}>
                        <Button type="primary">Tạo phòng ban</Button>
                    </Link>
                </div>
                <div
                    className="department-page-filter-email"
                    style={{
                        marginLeft: '10px',
                        marginRight: '10px',
                        marginTop: '20px',
                    }}
                >
                    <Input
                        type="text"
                        placeholder="Tên phòng ban..."
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
                <div
                    className="department-page-filter-button"
                    style={{ marginTop: '20px' }}
                >
                    <ButtonFilter buttonOnclick={onFilter} />
                </div>
            </div>
            <div className="cloud-vps-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={department}
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

export default Department
