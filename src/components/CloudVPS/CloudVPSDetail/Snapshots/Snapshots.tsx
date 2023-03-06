//@ts-nocheck
import {
    Button,
    Form,
    Input,
    Modal,
    Pagination,
    PaginationProps,
    Table,
    Tag,
} from 'antd'
import React, { CSSProperties, useEffect, useState } from 'react'
import { BiEdit } from 'react-icons/bi'
import { ColumnsType } from 'antd/lib/table'
import ISnapshots from '@/interfaces/ISnapshots'
import formatDate from '@/helpers/formatDate'
import { AiOutlineDelete } from 'react-icons/ai'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { TfiClose, TfiSave } from 'react-icons/tfi'
import TextArea from 'antd/lib/input/TextArea'
import {
    createSnapshot,
    deleteSnapshot,
    getSnapshotsByUserId,
} from '@/services/apis'
import ICloudServer from '@/interfaces/ICloudServer'
import { notify, notifyType } from '@/App'

const Snapshots = ({
    dataCloudServer,
    dataSnapshots,
}: {
    dataCloudServer?: ICloudServer
    dataSnapshots?: ISnapshots[]
}) => {
    const layout = useLayoutInit()
    const [snapshot, setSnapshot] = useState(dataSnapshots)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [newSnapshot, setNewSnapshot] = useState<ISnapshots>({
        content: '',
        status: 1,
    })

    const [pageIndex, setPageIndex] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [pageSize, setPageSize] = useState(1)
    const [totalItem, setTotalItem] = useState(1)

    const actionIconStyle = (color: string): CSSProperties => {
        return {
            fontSize: '18px',
            cursor: 'pointer',
            color: color,
        }
    }

    const columns: ColumnsType<ISnapshots> = [
        {
            title: 'MÃ SNAPSHOT',
            dataIndex: 'code',
        },
        {
            title: 'MÔ TẢ SNAPSHOT',
            dataIndex: 'content',
        },
        {
            title: 'NGÀY TẠO SNAPSHOT',
            dataIndex: 'createdTime',
            render: (value) => formatDate(value),
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'status',
            render: (value) =>
                value ? (
                    <Tag color="green">Bình thường</Tag>
                ) : (
                    <Tag color="red">Cảnh báo</Tag>
                ),
        },
        {
            title: 'THAO TÁC',
            dataIndex: 'control',
            render: (value, record) => (
                <div>
                    <span>
                        <BiEdit style={actionIconStyle('blue')} />
                    </span>
                    <span>
                        <AiOutlineDelete
                            onClick={() =>
                                layout.setModal(
                                    true,
                                    () => deleteItem(record._id || ''),
                                    'Bạn có muốn xoá khu vực này?',
                                    'Xoá khu vực'
                                )
                            }
                            style={actionIconStyle('red')}
                        />
                    </span>
                </div>
            ),
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

    const getSnapshots = async () => {
        try {
            layout.setLoading(true)
            const snapshots = await getSnapshotsByUserId(
                dataCloudServer?.user,
                dataCloudServer?._id,
                pageIndex
            )
            setSnapshot(snapshots.data?.data)
            setTotalPage(snapshots.data?.totalPages)
            setPageSize(Number(snapshots.data?.pageSize))
            setTotalItem(snapshots.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleSave = async () => {
        try {
            layout.setLoading(true)
            const formdata = new FormData()
            formdata.append('content', newSnapshot.content || '')
            formdata.append('cloudServer', dataCloudServer?._id || '')
            formdata.append('user', dataCloudServer?.user || '')
            formdata.append('status', '1')
            const create = await createSnapshot(formdata)
            if (create.data.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Tạo thành công')
                setIsModalOpen(false)
                getSnapshots()
            } else {
                notify(notifyType.NOTIFY_ERROR, create.data.message)
            }
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const deleteItem = async (id: string) => {
        try {
            layout.setLoading(true)
            const result = await deleteSnapshot(id)
            if (result.data.status == 1) {
                setSnapshot((state) => state?.filter((item) => item._id != id))
                notify(notifyType.NOTIFY_SUCCESS, 'Xoá thành công')
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

    useEffect(() => {
        getSnapshots()
    }, [pageIndex])
    const showTotal: PaginationProps['showTotal'] = (total) =>
        `Total ${total} items`

    return (
        <>
            <div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(!isModalOpen)}
                >
                    <i className="fa fa-save"></i>
                    Tạo Snapshots
                </button>
                <Modal
                    title="Tạo Snapshot cho VSK007_11"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            <TfiClose
                                size={10}
                                style={{ marginRight: '8px' }}
                            />
                            Đóng lại
                        </Button>,
                        <Button
                            key="submit"
                            onClick={() => handleSave()}
                            style={{ backgroundColor: '#1bc5bd' }}
                        >
                            <TfiSave size={10} style={{ marginRight: '8px' }} />
                            Lưu lại
                        </Button>,
                    ]}
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập tên khu vực',
                                },
                            ]}
                        >
                            <p>Mô tả Snapshot</p>
                            <TextArea
                                rows={4}
                                onChange={(e) =>
                                    setNewSnapshot({
                                        ...newSnapshot,
                                        content: e.target.value,
                                    })
                                }
                                value={newSnapshot.content}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <div className="cloud-vps-page-table">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={snapshot}
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

export default Snapshots
