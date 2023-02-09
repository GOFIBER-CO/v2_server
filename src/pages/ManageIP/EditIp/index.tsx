import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import Ip from '@/interfaces/IIps'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import { createIp, createOs, editIp, getAllOs, getIpById, getOs } from '@/services/apis'
import '@/styles/pages/OperatingSystem/CreateOperatingSystem/index.scss'
import { Button, Form, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useNavigate, useParams } from 'react-router'

const { Option } = Select

const EditIp = () => {
    const [ipEdit, setIpEdit] =
        useState<Ip>({
            ip: '',
            status: true,
        })

    const {id} = useParams()

    const navigate = useNavigate()

    const layout = useLayoutInit()

    const editIpById = async () => {
        try {
            if(!ipEdit.ip){
                notify(notifyType.NOTIFY_ERROR, 'IP không được để trống')
            }
            const result = await editIp(id || "", ipEdit.ip)
            if(result.data){
                notify(notifyType.NOTIFY_SUCCESS, 'Cập nhật IP thành công')
                navigate('/manage-ip')
            }
        } catch (error) {
            console.log(error)
            notify(notifyType.NOTIFY_ERROR, 'Cập nhật IP thất bại')
        }
    }

 
    const onFinished = async () => {
        editIpById()
    }

    const getById = async () => {
        try {
            const result = await getIpById(id || '')
            setIpEdit(result.data?.ip)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getById()
    },[])

    return (
        <div className="create-operating-system-page">
            <div className="create-operating-system-page-header">
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
                        <span>Thêm IP</span>
                    </li>
                </ul>
            </div>
            <div className="create-operating-system-page-input">
                <Form
                    style={{ marginTop: '25px' }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinished}
                >
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên hệ điều hành',
                            },
                        ]}
                    >
                        <p className="create-operating-system-page-input-label">
                            Địa chỉ IP:
                        </p>
                        <Input
                            placeholder="Địa chỉ IP"
                            onChange={(e) =>
                                setIpEdit({
                                    ...ipEdit,
                                    ip: e.target.value,
                                })
                            }
                            value={ipEdit.ip}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px', marginTop: '15px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Cập nhật
                        </Button>
                        <ButtonNavigator
                            url="/manage-ip"
                            name="Quay lại"
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditIp
