import '@/styles/pages/LoginNew/index.scss'
import React,{useState} from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';


const LoginNew = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    const onFinish = () => {
        auth.loginSync(username, password, navigate)
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className="LoginNew_cotainer">
            <div className="LoginNew_cotainer_center">
                <div className='LoginNew_container_title'>Đăng nhập</div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                      onFinish={onFinish}
                    //   onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    
                >
                    <div style={{marginTop:'20px'}} className='LoginNew_Form_email'>Email</div>
                    <Form.Item
                        className='LoginNew_From_Input' style={{border:'15px'}}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'email không được bỏ trống',
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
                    <div className='LoginNew_Form_email'>Password</div>
                    <Form.Item
                        className='LoginNew_From_Input' style={{border:'15px',}}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Password không được bỏ trống',
                            },
                        ]}
                        
                    >
                        <Input.Password 
                            
                              placeholder="Mật khẩu"
                              onChange={(e) => setPassword(e.target.value)}
                              prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                       style={{textAlign:'left'}}
                    >
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        
                        <Button type="primary" htmlType="submit" style={{width:'100%', borderRadius:'10px', height:'35px', fontSize:'16px'}}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <div>Bạn chưa có tài khoản? <span style={{color:'#00ACD7'}}><Link to={'/register'}>Đăng ký</Link></span> </div>
                </Form>
            </div>
        </div>
    )
}

export default LoginNew
