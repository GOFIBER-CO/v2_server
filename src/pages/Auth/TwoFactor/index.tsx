//@ts-nocheck
import { useAuth } from '@/hooks/useAuth'
import { UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import '@/styles/pages/Auth/TwoFactor/index.scss'
import { useState } from 'react'

const TwoFactor = () => {
    const [token, setToken] = useState('')
    const auth = useAuth()
    const navigate = useNavigate()
    const onFinish = async () => {
        auth.authenticate2FA(token, navigate)
    }

    return (
        <div className="two-factor-page-wrapper">
            <div className="two-factor--page">
                <div className="two-factor--page-logo">
                    <img
                        width={260}
                        height={'auto'}
                        src="/images/original-jpg_size_2640x711.jpeg"
                    />
                </div>
                <Form
                    style={{ marginTop: '25px' }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập mã xác thực',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Mã xác thực 6 chữ số"
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={auth.buttonLoading}
                        >
                            Xác thực
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default TwoFactor
