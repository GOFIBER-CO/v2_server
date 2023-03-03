import { notify, notifyType } from '@/App'
import IDepartment from '@/interfaces/IDepartment'
import {  getByIdDepartment } from '@/services/apis'
import { editDepartment } from '@/services/apiv2'
import '@/styles/pages/Location/CreateLocation/index.scss'
import { Button, Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useNavigate, useParams } from 'react-router'

const { Option } = Select

const EditDepartment = () => {
    const [newDepartment, setNewDepartment] = useState<string>('')
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const edit = getByIdDepartment(id)
        }
    }, [])

    const onFinished = async () => {
        const dataRef = {
            name: newDepartment
        } as any
        try {
            const edit = await editDepartment(id,dataRef )
            if (edit.data.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Chỉnh sửa thành công')
                navigate('/department')
            } else {
                notify(notifyType.NOTIFY_ERROR, edit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const turnBack = () => {
        navigate('/department')
    }

    return (
        <div className="create-location-page">
            <div className="create-location-page-header">
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
                        <span>Nhập phòng ban</span>
                    </li>
                </ul>
            </div>
            <div className="create-location-page-input">
                <Form
                    style={{ marginTop: '25px' }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinished}
                >
                    <Form.Item
                        name="server_name"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên phòng ban',
                            },
                        ]}
                    >
                        <Input
                            placeholder="Tên phòng ban"
                            onChange={(e) =>
                                setNewDepartment(e.target.value)
                            }
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px', marginTop: '15px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Lưu
                        </Button>
                        <Button
                            onClick={turnBack}
                            icon={<FaTimes style={{ verticalAlign: '-2px' }} />}
                            style={{
                                backgroundColor: '#e4e6ef',
                                color: 'black',
                                border: 'none',
                                fontWeight: '400',
                                marginLeft: '12px',
                            }}
                        >
                            Quay lại
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditDepartment
