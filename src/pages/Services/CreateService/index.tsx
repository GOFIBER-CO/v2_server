import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IService from '@/interfaces/IService'
import { createService } from '@/services/apis'
import '@/styles/pages/Services/CreateService/index.scss'
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'

const { Option } = Select

const CreateService = () => {
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
            const create = await createService(newService)
            if (create.data.status == 1)
                notify(notifyType.NOTIFY_SUCCESS, 'Tạo mới thành công')
            else notify(notifyType.NOTIFY_ERROR, create.data.message)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

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
                        <span>Tạo dịch vụ mới</span>
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
                                    defaultValue={1}
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
                                    Tạo mới
                                </Button>
                                <ButtonNavigator
                                    url="/service"
                                    name="Quay lại"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}

export default CreateService
