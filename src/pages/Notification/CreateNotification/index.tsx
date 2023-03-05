import INotification from '@/interfaces/INotification'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Select, SelectProps } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { type } from 'os'
import { useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { TfiMenuAlt } from 'react-icons/tfi'
import '@/styles/pages/Notification/CreateNotification/index.scss'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { createNotification, getAllUser } from '@/services/apiv2'
import { useAuth } from '@/hooks/useAuth'
import INewNotification from '@/interfaces/INewNotification'
import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'

const { Option } = Select

const CreateNotification = () => {
    const auth = useAuth()
    const [users, setUsers] = useState<
        {
            id: string
            userName: string
            role: { roleName: string }
            email: string
        }[]
    >([])
    const [newNotification, setNewNotification] = useState<INewNotification>({
        name: '',
        reciever: [],
        slug: '',
        type: 'shopping',
        status: false,
        content: '',
        sender: '',
        code: '',
    })

    const layout = useLayoutInit()

    const handleChangeDescription = (value: string) => {
        setNewNotification({ ...newNotification, content: value })
    }

    const getUsers = async () => {
        try {
            layout.setLoading(true)
            const result = await getAllUser()
            setUsers(result.data?.data)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const onCreateNotification = async () => {
        try {
            layout.setLoading(true)
            const result = await createNotification(newNotification)
            if (result.data.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, result.data.message)
            } else {
                notify(notifyType.NOTIFY_ERROR, result.data.message)
            }
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, error.response.data.message)
        }
    }

    const handleChange = (value: string[]) => {
        if (!value.includes('all'))
            setNewNotification({ ...newNotification, reciever: value })
        else {
            setNewNotification({
                ...newNotification,
                reciever: users?.map((item) => item.id),
            })
        }
    }

    useEffect(() => {
        setNewNotification({ ...newNotification, sender: auth.user?._id! })
        getUsers()
    }, [])
    const options: SelectProps['options'] = []

    return (
        <div className="create-notification-form">
            <div className="create-notification-form-header">
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
                        <span>Tạo thông báo</span>
                    </li>
                </ul>
            </div>
            <div className="create-notification-form-input">
                <div className="create-notification-form-input-level">
                    <p>Loại thông báo: </p>
                    <Select
                        defaultValue="shopping"
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setNewNotification({
                                ...newNotification,
                                type: value,
                            })
                        }
                    >
                        <Option value="shopping">Đơn hàng</Option>
                        <Option value="cash">Giao dịch</Option>
                        <Option value="ticket">Hỗ trợ</Option>
                        <Option value="home">Thông báo chung</Option>
                    </Select>
                </div>
                {/* <div className="create-notification-form-input-status">
                    <p>Trạng thái: </p>
                    <Select
                        defaultValue={false}
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setNewNotification({
                                ...newNotification,
                                status: value,
                            })
                        }
                    >
                        <Option value={true}>Hiển thị</Option>
                        <Option value={false}>Không hiển thị</Option>
                    </Select>
                </div> */}
                <div className="create-notification-form-input-room">
                    <p>Người nhận: </p>
                    <Select
                        mode="multiple"
                        optionFilterProp="children"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        onChange={handleChange}
                        value={newNotification?.reciever}
                    >
                        <Option value={'all'}>Select All</Option>
                        {users?.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.email}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="create-notification-form-input-title">
                    <p>Tiêu đề: </p>
                    <TextArea
                        onChange={(e) =>
                            setNewNotification({
                                ...newNotification,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="create-notification-form-input-description">
                    <p>Nội dung thông báo: </p>
                    <Editor
                        value={newNotification.content}
                        onEditorChange={handleChangeDescription}
                    />
                </div>
            </div>
            <div className="create-notification-form-button">
                <Button
                    icon={<AiOutlinePlus style={{ verticalAlign: '-2px' }} />}
                    style={{
                        backgroundColor: '#1bc5bd',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                    }}
                    onClick={() => onCreateNotification()}
                >
                    Tạo mới
                </Button>
                <ButtonNavigator url="/notification" name="Quay lại" />
            </div>
        </div>
    )
}

export default CreateNotification
