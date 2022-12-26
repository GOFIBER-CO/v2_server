import '@/styles/pages/RegisterNew/index.scss'
import React,{useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { useNavigate } from 'react-router'
import { notifyType } from '@/App'
import { notify } from '@/App'
import { signup } from '@/services/apis'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const RegisterNew = () => {
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
        <div className="RegisterNew_cotainer">
            <div className="RegisterNew_cotainer_center">
                <div className='RegisterNew_container_title'>Đăng ký</div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                      onFinish={onFinish}
                    //   onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    
                >
                    <div style={{marginTop:'20px'}} className='RegisterNew_Form_email'>Họ tên</div>
                    <Form.Item
                        className='RegisterNew_From_Input' style={{border:'15px'}}
                        name="hoTen"
                        rules={[
                            {
                                required: true,
                                message: 'Họ tên không được bỏ trống',
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
                    <div className='RegisterNew_Form_email'>Địa chỉ email</div>
                    <Form.Item
                        className='RegisterNew_From_Input' style={{border:'15px'}}
                        name="email"
                        
                        rules={[
                            {
                                required: true,
                                message: 'Email không được bỏ trống',
                            },
                        ]}
                    >
                        <Input type='email'
                            prefix={
                                <AiOutlineMail className="site-form-item-icon" />
                            }
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>

                    <div className='RegisterNew_Form_email'>Số điện thoại</div>
                    <Form.Item
                        className='RegisterNew_From_Input' style={{border:'15px'}}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Phone không được bỏ trống',
                            },
                        ]}
                    >
                        <Input type='number' 
                             prefix={
                                <AiOutlinePhone className="site-form-item-icon" />
                            }
                            placeholder="Số điện thoại"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Form.Item>


                    <div className='RegisterNew_Form_email'>Mật khẩu</div>
                    <Form.Item
                        className='RegisterNew_From_Input' style={{border:'15px'}}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Password không được bỏ trống',
                            },
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

                    <div className='RegisterNew_Form_email'>Nhập lại mật khẩu</div>
                    <Form.Item
                        className='RegisterNew_From_Input' style={{border:'15px'}}
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
                    <Form.Item>
                        
                        <Button type="primary" htmlType="submit" style={{width:'100%', borderRadius:'10px', height:'35px'}}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <div>Bạn đã có tài khoản? <span style={{color:'#00ACD7'}}><Link to={'/'}>Đăng nhập</Link></span> </div>
                </Form>
            </div>
        </div>
    )
}

export default RegisterNew
