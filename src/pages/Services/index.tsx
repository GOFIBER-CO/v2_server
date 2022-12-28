import { notify, notifyType } from '@/App'
import ButtonFilter from '@/components/ButtonFilter'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IService from '@/interfaces/IService'
import { deleteService, getService } from '@/services/apis'
import '@/styles/pages/Services/index.scss'
import { Button, Input, Pagination, PaginationProps, Select } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

const { Option } = Select

const Service = () => {
    const [filter, setFilter] = useState<{
        serviceName: string
        serverDefault: string
    }>({ serviceName: '', serverDefault: '' })
    const [services, setServices] = useState<IService[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [optionId, setOptionId] = useState(1)
    const [totalItem, setTotalItem] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    const layout = useLayoutInit()

    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const handleChangeOption = (id: number) => {
        setOptionId(id)
    }
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

    const getServices = async () => {
        try {
            layout.setLoading(true)
            const services = await getService(
                pageIndex,
                filter.serverDefault,
                filter.serviceName
            )
            setTotalPage(services.data.totalPages)
            setServices(services.data?.data)
            setPageSize(services.data?.pageSize)
            setTotalItem(services.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const deleteCurrentService = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá?')) {
            try {
                layout.setLoading(true)
                const result = await deleteService(id || '')
                if (result.data.status == 1) {
                    setServices((state) =>
                        state.filter((item) => item._id != id)
                    )
                    notify(notifyType.NOTIFY_SUCCESS, result.data.message)
                } else {
                    notify(notifyType.NOTIFY_ERROR, result.data.message)
                }
            } catch (error) {
                console.log(error)
                layout.setLoading(false)
                notify(notifyType.NOTIFY_ERROR, error.response.data.message)
            } finally {
                layout.setLoading(false)
            }
        }
    }

    const onFiltered = () => {
        getServices()
    }

    useEffect(() => {
        getServices()
    }, [pageIndex])

    const columns: ColumnsType<IService> = [
        {
            title: 'Mã server',
            dataIndex: 'code',
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'serverName',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
        },
        {
            title: 'RAM',
            dataIndex: 'ram',
        },
        {
            title: 'SSD',
            dataIndex: 'ssd',
        },
        {
            title: 'Băng thông',
            dataIndex: 'bandwidth',
        },
        {
            title: 'Transfer',
            dataIndex: 'tranfer',
        },
        {
            title: 'ipv4',
            dataIndex: 'ipv4',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'serverDefault',
            render: (value) => (value ? 'True' : 'False'),
        },
        {
            title: 'Giá theo',
            dataIndex: 'expiryDateType',
            render : (value) => (value == 1 ? 'Giờ' : (value == 2 ? 'Ngày' : (value == 3 ? '1 Tháng' : (value == 4 ? '3 Tháng' : (value == 5 ? '6 Tháng' : (value == 6 ? '1 Năm' : ''))))))
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
                        <Link to={`/service/${record._id}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                    <span>
                        <AiOutlineDelete
                            onClick={() =>
                                deleteCurrentService(record._id || '')
                            }
                            style={actionIconStyle('red')}
                        />
                    </span>
                </div>
            ),
        },
    ]

    return (
        <div className="service-page">
            <div className="service-page-header">
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
                        <span>Danh sách dịch vụ</span>
                    </li>
                </ul>
            </div>
            <div className="service-page-filter">
                <div
                    className="service-page-create-service"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/service/create-service'}>
                        <Button type="primary">Tạo dịch vụ</Button>
                    </Link>
                </div>
                <div
                    className="service-page-filter-name"
                    style={{ marginLeft: '20px', marginTop: '20px' }}
                >
                    <Input
                        type="text"
                        onChange={(e) =>
                            setFilter({
                                ...filter,
                                serviceName: e.target.value,
                            })
                        }
                        placeholder="Tên dịch vụ..."
                        style={{ width: '200px' }}
                    />
                </div>
                <div
                    className="service-page-filter-status"
                    style={{
                        marginLeft: '20px',
                        marginRight: '10px',
                        marginTop: '20px',
                    }}
                >
                    <Select
                        defaultValue=""
                        style={{ width: '200px' }}
                        onChange={(value) =>
                            setFilter({
                                ...filter,
                                serverDefault: value,
                            })
                        }
                    >
                        <Option value="">Chọn Server Default</Option>
                        <Option value="true">True</Option>
                        <Option value="false">False</Option>
                    </Select>
                </div>
                <div
                    className="service-page-filter-button"
                    style={{ marginTop: '20px' }}
                >
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="cloud-vps-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={services}
                    scroll={{ x: '1550px', y: '600px' }}
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

export default Service
