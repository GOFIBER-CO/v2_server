import { notify, notifyType } from '@/App'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { IUser } from '@/interfaces/IUser'
import { getUserById, updateProfile } from '@/services/apis'
import { getUserDetail } from '@/services/apiv2'
import '@/styles/pages/Profile/index.scss'
import { Button, Divider, Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'

const { Option } = Select

const Profile = () => {
    const [userProfile, setUserProfile] = useState<IUser>()
    const auth = useAuth()
    const layoutInit = useLayoutInit()
    const layout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 10 },
    }

    const onFinish = () => { }
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    }

    const getUser = async () => {
        try {
            layoutInit.setLoading(true)
            const result = await getUserDetail()
            setUserProfile(result.data?.data)
        } catch (error) {
            layoutInit.setLoading(false)
            console.log(error)
        } finally {
            layoutInit.setLoading(false)
        }
    }

    const updateUserProfile = async () => {
        try {
            layoutInit.setLoading(true)
            const result = await updateProfile(userProfile!.id, userProfile!)
            if (result.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, result.data.message)
            } else {
                notify(notifyType.NOTIFY_ERROR, result.data.message)
            }
        } catch (error) {
            console.log(error)
            layoutInit.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, error.response.data?.message)
        } finally {
            layoutInit.setLoading(false)
        }
    }
    useEffect(() => {
        getUser()
    }, [])
    return (
        <div className="profile-page">
            <div className="profile-page-title">
                <p className="profile-page-title-content">Sửa profile</p>
            </div>
            <Divider style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} />
            <div
                className="profile-page-input-wrapper"
                style={{ marginTop: '50px' }}
            >
                <div className="profile-page-input">
                    <Form
                        {...layout}
                        name="nest-messages"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            label="Mã khách hàng:"
                            rules={[{ required: true }]}
                        >
                            <Input value={userProfile?.id} disabled />
                        </Form.Item>
                        <Form.Item
                            label="Tên đăng nhập:"
                            rules={[{ required: true }]}
                        >
                            <Input value={userProfile?.email} disabled />
                        </Form.Item>
                        <Form.Item label="Họ và tên">
                            <Input
                                value={`${userProfile?.firstname} ${userProfile?.lastname}`}
                                disabled
                            />
                        </Form.Item>
                        <Form.Item label="Số điện thoại:">
                            <Input
                                value={userProfile?.phonenumber}
                                onChange={(e) =>
                                    setUserProfile({
                                        ...userProfile!,
                                        phonenumber: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ:">
                            <Input
                                value={userProfile?.address1}
                                onChange={(e) =>
                                    setUserProfile({
                                        ...userProfile!,
                                        phonenumber: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Quốc gia:">
                            <Input
                                value={userProfile?.countryname}
                                onChange={(e) =>
                                    setUserProfile({
                                        ...userProfile!,
                                        phonenumber: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                    </Form>
                    <div style={{textAlign: 'center'}}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            onClick={() => updateUserProfile()}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
