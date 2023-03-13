import '@/styles/pages/RegisterNew/index.scss'
import React, { useMemo, useState, useEffect } from 'react'
import { Button, Checkbox, Form, Input, Select } from 'antd'
import { useNavigate } from 'react-router'
import { notifyType } from '@/App'
import { notify } from '@/App'
import { signup } from '@/services/apiv2'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import nationJson from '@/config/nation.json'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import Loading from '@/components/Loading/Loading'
import Capcha from '@/components/CapchaComponent'
import appConfig from '@/config/appConfig'
import { is_phonenumber } from '@/helpers/checkPhone'

const { Option } = Select

type ObjecType = {
    [key: string]: string
}
var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
const RegisterNew = () => {
    const [buttonLoading, setButtonLoading] = useState(false)
    const [isDoneCaptcha, setIsDoneCaptcha] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [nation, setNation] = useState('vn')
    const [address, setAddress] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [re_password, setRePassword] = useState('')
    const navigate = useNavigate()

    const check = format.test(firstName)
    const checkLastName = format.test(lastName)

    useEffect(() => {
        if (check === true) {
            return notify('error', 'Họ không được nhập ký tự đặt biệt!')
        }
        if (checkLastName === true) {
            return notify('error', 'Tên không được nhập ký tự đặt biệt!')
        }
    }, [firstName,lastName])
    const urlImageNation = 'https://flagcdn.com/16x12'
    const onFinish = async () => {
        try {
            const checkPhone = is_phonenumber(phoneNumber)
            if(checkPhone === false){
                return notify("error","Số điện thoại không hợp lệ!")
            }
            setButtonLoading(true)
            const register = await signup({
                firstname: firstName,
                lastname: lastName,
                country: nation.toUpperCase(),
                address1: address,
                password: password,
                password2: re_password,
                email: email,
                phonenumber: phoneNumber,
            })
            if (register.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, register.data?.message)
                navigate('/')
            } else {
                notify(notifyType.NOTIFY_ERROR, register.data?.message)
            }
        } catch (error) {
            console.log(error)
            notify(notifyType.NOTIFY_ERROR, error.response.data)
        } finally {
            setButtonLoading(false)
        }
    }
    return (
        <div
            className={
                appConfig.PROJECT == 'gofiber'
                    ? 'RegisterNew_cotainer gofiber'
                    : 'RegisterNew_cotainer vietstack'
            }
        >
            {buttonLoading && <Loading />}
            <div className="RegisterNew_cotainer_center">
                <div className="RegisterNew_container_title">Đăng ký </div>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    //   onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <div
                        style={{ marginTop: '20px' }}
                        className="RegisterNew_Form_email"
                    >
                        Họ:
                    </div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="ho"
                        rules={[
                            {
                                required: true,
                                message: 'Không được bỏ trống họ',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Họ"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Item>
                    <div
                        style={{ marginTop: '20px' }}
                        className="RegisterNew_Form_email"
                    >
                        Tên:
                    </div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="ten"
                        rules={[
                            {
                                required: true,
                                message: 'Không được bỏ trống tên',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Tên"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Item>
                    <div
                        style={{ marginTop: '20px' }}
                        className="RegisterNew_Form_email"
                    >
                        Địa chỉ:
                    </div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: 'Không được bỏ trống địa chỉ',
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
                            placeholder="Địa chỉ"
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Form.Item>
                    <div
                        style={{ marginTop: '20px' }}
                        className="RegisterNew_Form_email"
                    >
                        Quốc gia:
                    </div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="nation"
                    >
                        <Select
                            style={{ textAlign: 'start' }}
                            defaultValue={'vn'}
                            onChange={(value) => setNation(value)}
                        >
                            {
                                //@ts-ignore
                                Object.keys(nationJson).map((key, index) => (
                                    <Option key={key} value={key}>
                                        <img
                                            style={{ marginRight: '5px' }}
                                            src={`${urlImageNation}/${key}.png`}
                                        />
                                        {nationJson[key as keyof ObjecType]}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <div className="RegisterNew_Form_email">Địa chỉ email</div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Email không được bỏ trống',
                            },
                        ]}
                    >
                        <Input
                            type="email"
                            prefix={
                                <AiOutlineMail className="site-form-item-icon" />
                            }
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>

                    <div className="RegisterNew_Form_email">Số điện thoại</div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Phone không được bỏ trống',
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            prefix={
                                <AiOutlinePhone className="site-form-item-icon" />
                            }
                            placeholder="Số điện thoại"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Form.Item>

                    <div className="RegisterNew_Form_email">Mật khẩu</div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
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

                    <div className="RegisterNew_Form_email">
                        Nhập lại mật khẩu
                    </div>
                    <Form.Item
                        className="RegisterNew_From_Input"
                        style={{ border: '15px' }}
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
                                            'Mật khẩu nhập lại không hợp lệ!'
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
                    <Capcha setIsDone={setIsDoneCaptcha} />
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '100%',
                                borderRadius: '10px',
                                height: '35px',
                                fontSize: '16px',
                                marginTop: '10px',
                            }}
                            disabled={!isDoneCaptcha}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <div>
                        Bạn đã có tài khoản?{' '}
                        <span style={{ color: '#00ACD7' }}>
                            <Link to={'/'}>Đăng nhập</Link>
                        </span>{' '}
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default RegisterNew
