import { notify, notifyType } from '@/App'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { changePassword } from '@/services/apis'
import '@/styles/pages/ChangePassword/index.scss'
import { LockOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input } from 'antd'
import { useState } from 'react'

const ChangePassword = () => {
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [reNewPassword, setReNewPassword] = useState('')
    const layoutInit = useLayoutInit()
    const layout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 10 },
    }
    const auth = useAuth()

    const onFinish = async () => {
        try {
            layoutInit.setLoading(true)
            const result = await changePassword(
                auth.user._id,
                password,
                newPassword
            )
            if (result.data) {
                notify(notifyType.NOTIFY_SUCCESS, 'Đổi mật khẩu thành công')
            }
        } catch (error) {
            console.log(error)
            layoutInit.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, error.response.data.message)
        } finally {
            layoutInit.setLoading(false)
        }
    }

    return (
        <div className="change-password-page">
            <div className="change-password-page-title">
                <p className="profile-page-title-content">Đổi mật khẩu</p>
            </div>
            <Divider style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} />
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                style={{ marginTop: '50px' }}
            >
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Hãy nhập mật khẩu!' }]}
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
                    label="Mật khẩu mới"
                    name="new_password"
                    rules={[
                        { required: true, message: 'Hãy nhập mật khẩu mới!' },
                    ]}
                >
                    <Input.Password
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Mật khẩu mới"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="re_new_password"
                    dependencies={['new_password']}
                    rules={[
                        {
                            required: true,
                            message: 'Hãy nhập lại mật khẩu mới của bạn',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue('new_password') === value
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
                        onChange={(e) => setReNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11 }}>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ChangePassword
