import { notify, notifyType } from '@/App'
import ButtonFilter from '@/components/ButtonFilter'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IOparatingSystem from '@/interfaces/IOperatingSystem'
import { deleteOs, getAllOs } from '@/services/apis'
import '@/styles/pages/OperatingSystem/index.scss'
import { Button, Input, Pagination, PaginationProps, Select, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

const { Option } = Select

const OperatingSystem = () => {
    const [operatingSystems, setOperatingSystems] = useState<
        IOparatingSystem[]
    >([])
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
    const [filter, setFilter] = useState<{ operatingSystemName: string }>({
        operatingSystemName: '',
    })

    const layout = useLayoutInit()

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const getOs = async () => {
        try {
            layout.setLoading(true)
            const os = await getAllOs(pageIndex, filter.operatingSystemName)
            setOperatingSystems(os.data?.data)
            setTotalPage(os.data?.totalPages)
            setPageSize(os.data?.pageSize)
            setTotalItem(os.data?.totalItem)
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

    const deleteOperatingSystem = async (id: string) => {
        try {
            layout.setLoading(true)
            const result = await deleteOs(id)
            if (result.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Xoá thành công')
                setOperatingSystems((state) =>
                    state.filter((item) => item._id != id)
                )
            } else {
                notify(notifyType.NOTIFY_ERROR, 'Xoá thất bại')
            }
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const onFiltered = () => {
        getOs()
    }

    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }

    const columns: ColumnsType<IOparatingSystem> = [
        {
            title: 'Mã HĐH',
            dataIndex: 'code',
        },
        {
            title: 'Tên hệ điều hành',
            dataIndex: 'operatingSystemName',
        },
        {
            title: 'Parent',
            dataIndex: 'parentName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            key: 'id',
            title: 'Điều khiển',
            dataIndex: 'control',
            render: (value, record) => (
                <div>
                    <span>
                        <Link to={`/operating-system/${record._id}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                    <span>
                        <AiOutlineDelete
                            onClick={() =>
                                layout.setModal(
                                    true,
                                    () =>
                                        deleteOperatingSystem(record._id || ''),
                                    'Bạn có muốn xoá hệ điều hành này?',
                                    'Xoá hệ điều hành'
                                )
                            }
                            style={actionIconStyle('red')}
                        />
                    </span>
                </div>
            ),
        },
    ]

    useEffect(() => {
        getOs()
    }, [pageIndex])
    return (
        <div className="operating-system-page">
            <div className="operating-system-page-header">
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
                        <span>Danh sách hệ điều hành</span>
                    </li>
                </ul>
            </div>
            <div className="operating-system-page-filter">
                <div
                    className="operating-system-page-create-operating-system"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/operating-system/create-operating-system'}>
                        <Button type="primary">Tạo hệ điều hành</Button>
                    </Link>
                </div>
                <Input
                    type="text"
                    placeholder="Tên HĐH..."
                    style={{
                        width: '200px',
                        marginLeft: '15px',
                        marginRight: '15px',
                        marginTop: '20px',
                    }}
                    onChange={(e) =>
                        setFilter({
                            ...filter,
                            operatingSystemName: e.target.value,
                        })
                    }
                />
                <div
                    className="operating-system-page-filter-button"
                    style={{ marginTop: '20px' }}
                >
                    <ButtonFilter buttonOnclick={onFiltered}></ButtonFilter>
                </div>
            </div>
            <div className="operating-system-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={operatingSystems}
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

export default OperatingSystem
