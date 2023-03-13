import { useAuth } from '@/hooks/useAuth'
import '@/styles/pages/Auth/Auth.scss'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Auth: React.FC = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const onFinish = () => {
        auth.loginSync(username, password, navigate)
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="auth-page-wrapper">
            <div className="auth-page">
                <div className="auth-page-logo">
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
                                message: 'Hãy nhập tên đăng nhập!',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Tên đăng nhập"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Hãy nhập mật khẩu!' },
                        ]}
                    >
                        <Input
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder="Mật khẩu"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>Ghi nhớ đăng nhập </Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">
                            Quên mật khẩu
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={auth.buttonLoading}
                        >
                            Đăng nhập
                        </Button>
                        hoặc <Link to="/register">Đăng kí ngay!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Auth
