import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IService from '@/interfaces/IService'
import { createService, editService, getServiceById } from '@/services/apis'
import '@/styles/pages/Services/CreateService/index.scss'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Link, useParams } from 'react-router-dom'

const { Option } = Select

const EditService = () => {
    const { id } = useParams()
    const [newService, setNewService] = useState<IService>({
        serverName: '',
        ssd: '',
        bandwidth: '',
        price: 0,
        cpu: '',
        ram: '',
        tranfer: '',
        serverDefault: true,
        ipv4: '',
        code: '',
        expiryDateType: 1,
    })

    const layout = useLayoutInit()

    const onFinish = async () => {
        try {
            layout.setLoading(true)
            const create = await editService(id || '', newService)
            if (create.data.status == 1)
                notify(notifyType.NOTIFY_SUCCESS, 'Cập nhật thành công')
            else notify(notifyType.NOTIFY_ERROR, create.data.message)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const getService = async () => {
        try {
            layout.setLoading(true)
            const result = await getServiceById(id || '')
            setNewService({
                ...newService,
                serverName: result.data.serverName,
                ssd: result.data.ssd,
                bandwidth: result.data.bandwidth,
                price: result.data.price,
                cpu: result.data.cpu,
                ram: result.data.ram,
                tranfer: result.data.tranfer,
                serverDefault: result.data.serverDefault,
                ipv4: result.data.ipv4,
                expiryDateType: result.data.expiryDateType,
            })
        } catch (error) {
            console.log(error)
            layout.setLoading(true)
        } finally {
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getService()
    }, [])

    return (
        <div className="create-service-page">
            <div className="create-service-page-header">
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
                        <span>Cập nhật dịch vụ</span>
                    </li>
                </ul>
            </div>
            <div className="create-service-page-input">
                <Form
                    style={{ marginTop: '25px' }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Row gutter={[16, 16]}>
                        <Col lg={12} md={12} sm={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập tên dịch vụ server',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    Tên dịch vụ:
                                </p>
                                <Input
                                    placeholder="Tên dịch vụ"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            serverName: e.target.value,
                                        })
                                    }
                                    value={newService.serverName}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập giá!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    Giá dịch vụ:
                                </p>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    type="price"
                                    placeholder="Giá dịch vụ"
                                    onChange={(value) =>
                                        setNewService({
                                            ...newService,
                                            price: Number(value),
                                        })
                                    }
                                    value={newService.price}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập CPU!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    CPU:
                                </p>
                                <Input
                                    placeholder="Nhập CPU"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            cpu: e.target.value,
                                        })
                                    }
                                    value={newService.cpu}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập RAM!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    RAM:
                                </p>
                                <Input
                                    placeholder="RAM"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            ram: e.target.value,
                                        })
                                    }
                                    value={newService.ram}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập SSD!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    SSD:
                                </p>
                                <Input
                                    placeholder="SSD"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            ssd: e.target.value,
                                        })
                                    }
                                    value={newService.ssd}
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập băng thông!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    Băng thông:
                                </p>
                                <Input
                                    placeholder="Băng thông"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            bandwidth: e.target.value,
                                        })
                                    }
                                    value={newService.bandwidth}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập Transfer!',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    Transfer:
                                </p>
                                <Input
                                    placeholder="Transfer"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            tranfer: e.target.value,
                                        })
                                    }
                                    value={newService.tranfer}
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập IPV4',
                                    },
                                ]}
                            >
                                <p className="create-service-page-input-label">
                                    IPV4:
                                </p>
                                <Input
                                    placeholder="IPV4"
                                    onChange={(e) =>
                                        setNewService({
                                            ...newService,
                                            ipv4: e.target.value,
                                        })
                                    }
                                    value={newService.ipv4}
                                />
                            </Form.Item>
                            <p
                                style={{
                                    marginBottom: '5px',
                                    marginTop: '0px',
                                }}
                            >
                                Server default:{' '}
                            </p>
                            <Select
                                defaultValue="true"
                                style={{ width: '100%' }}
                                onChange={(value) =>
                                    setNewService({
                                        ...newService,
                                        serverDefault:
                                            value == 'true' ? true : false,
                                    })
                                }
                                value={
                                    newService.serverDefault ? 'true' : 'false'
                                }
                            >
                                <Option value="true">True</Option>
                                <Option value="false">False</Option>
                            </Select>
                            <Form.Item style={{ marginTop: '24px' }}>
                                <p
                                    style={{
                                        marginBottom: '5px',
                                        marginTop: '0px',
                                    }}
                                >
                                    Giá theo:
                                </p>
                                <Select
                                    value={newService.expiryDateType}
                                    style={{ width: '100%' }}
                                    onChange={(value) =>
                                        setNewService({
                                            ...newService,
                                            expiryDateType: value,
                                        })
                                    }
                                >
                                    <Option value={1}>Giá theo giờ</Option>
                                    <Option value={2}>Giá theo ngày</Option>
                                    <Option value={3}>Giá theo tháng</Option>
                                    <Option value={4}>Giá theo 3 tháng</Option>
                                    <Option value={5}>Giá theo 6 tháng</Option>
                                    <Option value={6}>Giá theo năm</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            style={{
                                marginRight: '10px',
                                marginTop: '15px',
                            }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Lưu
                        </Button>
                        <ButtonNavigator url="/service" name="Quay lại" />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditService
