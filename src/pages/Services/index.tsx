import { notify, notifyType } from '@/App'
import ButtonFilter from '@/components/ButtonFilter'
import formatDate from '@/helpers/formatDate'
import formatMoney from '@/helpers/formatMoney'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IService from '@/interfaces/IService'
import { deleteService } from '@/services/apis'
import {  getService } from '@/services/apiv2'
import '@/styles/pages/Services/index.scss'
import { Button, Input, Pagination, PaginationProps, Select } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import {convertDescriptionProductToObject} from "../../helpers/index"

const { Option } = Select

const Service = () => {
    const [filter, setFilter] = useState<{
        serviceName: string
        serverDefault: string
    }>({ serviceName: '', serverDefault: '' })
    const [services, setServices] = useState<IService[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
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
                filter.serviceName,
                pageSize
            )
            setTotalPage(services.data.totalPages)
            setServices(services.data?.data)
            setTotalItem(services.data?.count)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const deleteCurrentService = async (id: string) => {
        if (window.confirm('B???n c?? ch???c ch???n mu???n xo???')) {
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
    }, [pageIndex, pageSize])

    const columns: ColumnsType<IService> = [
        {
            title: 'M?? server',
            dataIndex: 'object_id',
        },
        {
            title: 'T??n d???ch v???',
            dataIndex: 'name',
        },
        {
            title: 'Gi?? theo th??ng',
            dataIndex: 'm',
            render(value, record, index) {
                return formatMoney(value)
            },
        },
        {
            title: 'Gi?? theo 3 th??ng',
            dataIndex: 'q',
            render(value, record, index) {
                return formatMoney(value)
            },
        },
        {
            title: 'Gi?? theo 6 th??ng',
            dataIndex: 's',
            render(value, record, index) {
                return formatMoney(value)
            },
        },
        {
            title: 'Gi?? theo 1 n??m',
            dataIndex: 'a',
            render(value, record, index) {
                return formatMoney(value)
            },
        },
        {
            title: 'RAM',
            dataIndex: 'description',
            render(value, record, index) {
                const data = convertDescriptionProductToObject(value)
               
                return<>{data.Ram}</>
            },
        },
        {
            title: 'SSD',
            dataIndex: 'description',
            render(value, record, index) {
                const data = convertDescriptionProductToObject(value)
               
                return<>{data.Storage}</>
            },
        },
        {
            title: 'B??ng th??ng',
           dataIndex: 'description',
          render(value, record, index) {
              const data = convertDescriptionProductToObject(value)
             
              return<>{data.Bandwidth}</>
          },
        },
        {
            title: 'CPU',
            dataIndex: 'description',
            render(value, record, index) {
                const data = convertDescriptionProductToObject(value)
               
                return<>{data.CPU}</>
            },
        },
        // {
        //     title: 'ipv4',
        //     dataIndex: 'ipv4',
        // },
        {
            title: 'Tr???ng Th??i',
            dataIndex: 'serverDefault',
            render: (value) => (value ? 'True' : 'False'),
        },
        // {
        //     title: 'Gi?? theo',
        //     dataIndex: 'expiryDateType',
        //     render: (value) =>
        //         value == 1
        //             ? 'Gi???'
        //             : value == 2
        //             ? 'Ng??y'
        //             : value == 3
        //             ? '1 Th??ng'
        //             : value == 4
        //             ? '3 Th??ng'
        //             : value == 5
        //             ? '6 Th??ng'
        //             : value == 6
        //             ? '1 N??m'
        //             : '',
        // },
        {
            title: 'Ng??y t???o',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        // {
        //     key: 'id',
        //     title: '??i???u khi???n',
        //     dataIndex: 'control',
        //     render: (value, record) => (
        //         <div>
        //             <span>
        //                 <Link to={`/service/${record._id}`}>
        //                     <BiEdit style={actionIconStyle('blue')} />
        //                 </Link>
        //             </span>
        //             <span>
        //                 <AiOutlineDelete
        //                     onClick={() =>
        //                         deleteCurrentService(record._id || '')
        //                     }
        //                     style={actionIconStyle('red')}
        //                 />
        //             </span>
        //         </div>
        //     ),
        // },
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
                        <span>Danh s??ch d???ch v???</span>
                    </li>
                </ul>
            </div>
            <div className="service-page-filter">
                {/* <div
                    className="service-page-create-service"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/service/create-service'}>
                        <Button type="primary">T???o d???ch v???</Button>
                    </Link>
                </div> */}
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
                        placeholder="T??n d???ch v???..."
                        style={{ width: '200px' }}
                    />
                </div>
                {/* <div
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
                        <Option value="">Ch???n Server Default</Option>
                        <Option value="true">True</Option>
                        <Option value="false">False</Option>
                    </Select>
                </div> */}
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

export default Service
