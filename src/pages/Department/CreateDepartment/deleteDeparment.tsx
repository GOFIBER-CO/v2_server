import { notify, notifyType } from '@/App'
import IDepartment from '@/interfaces/IDepartment'
import { deleteDepartment, getByIdDepartment } from '@/services/apis'
import '@/styles/pages/Location/CreateLocation/index.scss'
import { Button, Form, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useNavigate, useParams } from 'react-router'

const { Option } = Select

const DeleteDepartment = () => {
    const [newDepartment, setNewDepartment] = useState<IDepartment>({
        processingRoomName: '',
        code: '',
    })
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            const edit = getByIdDepartment(id)
        }
    }, [])

    const onFinished = async () => {
        try {
            const del = await deleteDepartment(id)
            notify(notifyType.NOTIFY_SUCCESS, 'xóa thành công')
            navigate('/department')
            // if (del.data.status == 1) {
            //     notify(notifyType.NOTIFY_SUCCESS, 'xóa thành công')
            //     navigate('/department')
            // } else {
            //     notify(notifyType.NOTIFY_ERROR, del.data.message)
            // }
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
                        <span>Xóa phòng ban</span>
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
                    <p>{id}</p>
                    {/* <Form.Item
                        name="server_name"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên phòng ban',
                            },
                        ]}
                    >
                        <Input
                            id='nameDeparment'
                            placeholder="Tên phòng ban"
                            onChange={(e) =>
                                setNewDepartment({
                                    ...newDepartment,
                                    processingRoomName: e.target.value,
                                })
                            }
                        />
                    </Form.Item> */}
                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px', marginTop: '15px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Xóa
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

export default DeleteDepartment
