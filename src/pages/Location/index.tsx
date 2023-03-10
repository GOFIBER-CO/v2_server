import { notify, notifyType } from '@/App'
import ButtonFilter from '@/components/ButtonFilter'
import formatDate from '@/helpers/formatDate'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IArea from '@/interfaces/IArea'
import { deleteLocation, getAllLocation } from '@/services/apis'
import '@/styles/pages/Location/index.scss'
import { Button, Pagination, PaginationProps, Tag } from 'antd'
import Input from 'antd/lib/input/Input'
import Table, { ColumnsType } from 'antd/lib/table'
import { CSSProperties, useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiEdit } from 'react-icons/bi'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

const Location = () => {
    const [filter, setFilter] = useState('')
    const [locations, setLocations] = useState<IArea[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const layout = useLayoutInit()

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const getLocations = async () => {
        try {
            layout.setLoading(true)
            const location = await getAllLocation(pageIndex, filter, pageSize)
            setLocations(location.data?.data)
            setTotalPage(location.data?.totalPages)
            setTotalItem(location.data?.totalItem)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const deleteCurrentLocation = async (id: string) => {
        try {
            layout.setLoading(true)
            const result = await deleteLocation(id)
            if (result.data.status == 1) {
                setLocations((state) => state.filter((item) => item._id != id))
                notify(notifyType.NOTIFY_SUCCESS, 'Xo?? th??nh c??ng')
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

    const onFiltered = () => {
        getLocations()
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
    const columns: ColumnsType<IArea> = [
        {
            title: 'M?? v??ng',
            dataIndex: 'code',
        },
        {
            title: 'T??n v??ng',
            dataIndex: 'areaName',
        },
        {
            title: 'Qu???c gia',
            dataIndex: 'country',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (value) =>
                value == 0 ? (
                    <Tag color="green">??ang ho???t ?????ng</Tag>
                ) : (
                    <Tag color="red">D???ng ho???t ?????ng</Tag>
                ),
        },
        {
            title: 'Ng??y t???o',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            title: '??i???u khi???n',
            dataIndex: 'control',
            render: (value, record) => (
                <div>
                    <span>
                        <Link to={`/location/${record._id}`}>
                            <BiEdit style={actionIconStyle('blue')} />
                        </Link>
                    </span>
                    <span>
                        <AiOutlineDelete
                            onClick={() =>
                                layout.setModal(
                                    true,
                                    () =>
                                        deleteCurrentLocation(record._id || ''),
                                    'B???n c?? mu???n xo?? khu v???c n??y?',
                                    'Xo?? khu v???c'
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
        getLocations()
    }, [pageIndex, pageSize])
    return (
        <div className="location-page">
            <div className="location-page-header">
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
                        <span>Khu v???c</span>
                    </li>
                </ul>
            </div>
            <div className="location-page-filter">
                <div
                    className="location-page-create-location"
                    style={{ marginTop: '20px' }}
                >
                    <Link to={'/location/create-location'}>
                        <Button type="primary">T???o khu v???c</Button>
                    </Link>
                </div>
                <div
                    className="location-page-filter-input"
                    style={{
                        marginLeft: '20px',
                        marginRight: '10px',
                        marginTop: '20px',
                    }}
                >
                    <Input
                        type="text"
                        placeholder="Nh???p t??n khu v???c... "
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ width: '200px' }}
                    />
                </div>
                <div
                    className="location-page-filter-input"
                    style={{ marginTop: '20px' }}
                >
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="cloud-vps-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={locations}
                    scroll={{ x: '1000px', y: '600px' }}
                    pagination={false}
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

export default Location
