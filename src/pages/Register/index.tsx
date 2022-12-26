import { notify } from '@/App'
import { useAuth } from '@/hooks/useAuth'
import { signup } from '@/services/apis'
import '@/styles/pages/Register/index.scss'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useState } from 'react'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { notifyType } from '@/App'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [buttonLoading, setButtonLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [re_password, setRePassword] = useState('')
    const navigate = useNavigate()

    const onFinish = async () => {
        try {
            setButtonLoading(true)
            const register = await signup({
                userName: username,
                password: password,
                email: email,
                phoneNumber: phoneNumber,
            })
            if (register.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, register.data?.message)
                navigate('/')
            } else {
                notify(notifyType.NOTIFY_ERROR, register.data?.message)
            }
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        } finally {
            setButtonLoading(false)
        }
    }

    return (
        <div className="register-page-wrapper">
            <div className="register-page">
                <div className="register-page-logo">
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
                        <Input.Password
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder="Mật khẩu"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="re_password"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập lại mật khẩu của bạn',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'The two passwords that you entered do not match!'
                                        )
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            onChange={(e) => setRePassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên email',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <AiOutlineMail className="site-form-item-icon" />
                            }
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập số điện thoại',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <AiOutlinePhone className="site-form-item-icon" />
                            }
                            placeholder="Số điện thoại"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Đăng ký
                        </Button>
                        <Link to="/">Quay lại trang đăng nhập!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register
