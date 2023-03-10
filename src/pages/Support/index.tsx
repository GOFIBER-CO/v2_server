import ButtonFilter from '@/components/ButtonFilter'
import appConfig from '@/config/appConfig'
import formatDate from '@/helpers/formatDate'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getSupportByUserId } from '@/services/apiv2'

import '@/styles/pages/SupportPage/Support.scss'
import {
    AutoComplete,
    Button,
    Input,
    Pagination,
    PaginationProps,
    Select,
    Tag,
} from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link } from 'react-router-dom'

import './Support.css'

const { Option } = Select

const Support: React.FC = () => {
    const auth = useAuth()
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }
    const [tickets, setTickes] = useState<ITicket[]>([])
    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalItem, setTotalItem] = useState(1)
    const [filter, setFilter] = useState<{
        SupportTT: string
        SupportUT: string
        supportName: string
    }>({ SupportTT: '', SupportUT: '', supportName: '' })
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    const layout = useLayoutInit()
    useEffect(() => {
        getAllTickets()
    }, [pageIndex, pageSize])

    const getAllTickets = async () => {
        try {
            layout.setLoading(true)
            const result = await getSupportByUserId(              
                pageIndex,
                filter.SupportTT,
                filter.SupportUT,
                filter.supportName,
                pageSize
            )
            setTickes(result.data?.data)
            setTotalPage(result.data?.totalPages)
            setTotalItem(result.data?.totalItem)
            
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const columns: ColumnsType<ITicket> = [
        // {
        //     title: 'M?? y??u c???u',
        //     dataIndex: 'ticket_number',
        // },
        {
            title: 'Ti??u ?????',
            dataIndex: 'subject',
            // render: (value) => value?.title,
        },
        {
            title: 'C???p ????? ??u ti??n',
            dataIndex: 'level',
            render: (value) =>
                value == 1 ? (
                    <Tag color="green">B??nh Th?????ng</Tag>
                ) : value == 2 ? (
                    <Tag color="yellow">??u Ti??n</Tag>
                ) : (
                    <Tag color="red">Kh???n C???p</Tag>
                ),
        },
        {
            title: 'Ph??ng ban',
            dataIndex: 'dept_id',
            render: (value,record) => {
                return <>{value?.name}</>
            },
        },
        // {
        //     title: 'M?? kh??ch h??ng',
        //     dataIndex: 'user',
        //     // render: (value) => value?._id,
        // },
       
        {
            title: 'File ????nh k??m',
            dataIndex: 'file',
            render: (value) => (
                <a
                    target={'_blank'}
                    href={`${appConfig.API_URL_UPLOAD_FILES}/${value}`}
                >
                    {value}
                </a>
            ),
        },
        {
            title: 'Tr???ng th??i',
            dataIndex: 'status',
            render: (value) =>
                value == '1' ? (
                    <Tag color="green">???? gi???i quy???t</Tag>
                    
                ) : value == '2' ? (
                    <Tag color="orange">??ang ch??? gi???i quy???t</Tag>
                ) : (
                    <Tag color="red">Ch??a x??c nh???n</Tag>
                ),
        },
        {
            title: 'Ng??y t???o',
            dataIndex: 'updatedAt',
            render: (value) => formatDate(value),
        },
    ]

    const onFiltered = () => {
        getAllTickets()
    }

    return (
        <div className="support-page">
            <div className="support-page-header">
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
                        <span>Danh s??ch ticket</span>
                    </li>
                </ul>
            </div>
            <div className="support-page-filter">
                <div className="support-page-create-ticket">
                    <Link to={'/support/create-ticket'}>
                        <Button type="primary">T???o ticket</Button>
                    </Link>
                </div>
                {/* <div
                    className="support-page-create-ticket"
                    style={{ marginLeft: '10px' }}
                >
                    <Select
                        defaultValue="--Tr???ng th??i--"
                        style={{ width: 130 }}
                        onChange={(value) =>
                            setFilter({
                                ...filter,
                                SupportTT: value,
                            })
                        }
                    >
                        <Option value={0}>Ch??a x??c nh???n</Option>
                        <Option value={1}>X??c nh???n</Option>
                        <Option value={2}>Ho??n th??nh</Option>
                    </Select>
                </div> */}
                <div
                    className="support-page-create-ticket"
                    style={{ marginLeft: '10px' }}
                >
                    <Select
                        defaultValue="--C???p ??u ti??n--"
                        style={{ width: 140 }}
                        onChange={(value) =>
                            setFilter({
                                ...filter,
                                SupportUT: value,
                            })
                        }
                        options={[
                            {
                                value: '',
                                label: 'T???t c???',
                            },
                            {
                                value: 1,
                                label: 'B??nh th?????ng',
                            },
                            {
                                value: 2,
                                label: '??u ti??n',
                            },
                            {
                                value: 3,
                                label: 'Kh???n c???p',
                            },
                        ]}
                    />
                </div>

                <div
                    className="support-page-create-ticket"
                    style={{ marginLeft: '10px' }}
                >
                    <Input
                        onChange={(e) =>
                            setFilter({
                                ...filter,
                                supportName: e.target.value,
                            })
                        }
                    />
                </div>

                <div
                    className="support-page-create-ticket"
                    style={{ marginLeft: '10px' }}
                >
                    <ButtonFilter buttonOnclick={onFiltered}></ButtonFilter>
                </div>
                <div className="support-page-filter-general"></div>
                {/* <div className="support-page-filter-submit">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div> */}
            </div>
            <div className="support-page-table">
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={tickets}
                    scroll={{ x: '1300px', y: '600px' }}
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

export default Support
