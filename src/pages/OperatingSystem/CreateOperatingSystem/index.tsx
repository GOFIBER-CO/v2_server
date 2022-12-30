import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import { createOs, getAllOs, getOs } from '@/services/apis'
import '@/styles/pages/OperatingSystem/CreateOperatingSystem/index.scss'
import { Button, Form, Input, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'

const { Option } = Select

const CreateOperatingSystem = () => {
    const [operatingSystems, setOperatingSystem] =
        useState<IOperatingSystem[]>()
    const [newOperatingSystem, setNewOperatingSystem] =
        useState<IOperatingSystem>({
            operatingSystemName: '',
            parentID: '',
            file: null,
            code: '',
            createdTime: '',
            children: [],
        })
    const acceptFileType: string[] = [
        'image/gif',
        'image/jpeg',
        'image/png',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
    ]
    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (acceptFileType.includes(e.target.files[0].type)) {
                setNewOperatingSystem({
                    ...newOperatingSystem,
                    file: e.target.files[0],
                })
            } else {
                message.error('File này không được hỗ trợ')
            }
        }
    }

    const layout = useLayoutInit()

    const getOperatingSystems = async () => {
        try {
            layout.setLoading(true)
            const result = await getOs()
            setOperatingSystem(result.data?.data)
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    const createNewOperatingSystem = async () => {
        try {
            layout.setLoading(true)
            const formdata = new FormData()
            formdata.append(
                'operatingSystemName',
                newOperatingSystem.operatingSystemName
            )
            formdata.append('parentID', newOperatingSystem.parentID || '')
            formdata.append('file', newOperatingSystem.file || '')
            const create = await createOs(formdata)
            // console.log(create.data)
            if (create.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Tạo thành công')
            } else {
                notify(notifyType.NOTIFY_ERROR, 'Tạo thất bại')
            }
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    const onFinished = async () => {
        createNewOperatingSystem()
    }

    useEffect(() => {
        getOperatingSystems()
    }, [])
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
                        <span>Thêm hệ điều hành</span>
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
                            Tên hệ điều hành:
                        </p>
                        <Input
                            placeholder="Tên hệ điều hành"
                            onChange={(e) =>
                                setNewOperatingSystem({
                                    ...newOperatingSystem,
                                    operatingSystemName: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <p className="create-operating-system-page-input-label">
                        Hệ điều hành cha:
                    </p>
                    <Select
                        defaultValue=""
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setNewOperatingSystem({
                                ...newOperatingSystem,
                                parentID: value,
                            })
                        }
                    >
                        <Option value="">
                            Chọn hệ điều hành cha (chọn option này nếu đây là hệ
                            điều hành cha)
                        </Option>
                        {operatingSystems?.map((item) => (
                            <Option key={item._id} value={`${item._id}`}>
                                {item.operatingSystemName}
                            </Option>
                        ))}
                    </Select>
                    <div className="create-operating-system-page-input-image">
                        <p>Chọn file đính kèm: </p>
                        <input type={'file'} onChange={handleUploadFile} />
                        <div className="create-operating-system-page-input-image-preview">
                            <img
                                src={
                                    (newOperatingSystem.file &&
                                        typeof newOperatingSystem.file !=
                                            'string' &&
                                        URL.createObjectURL(
                                            newOperatingSystem.file
                                        )) ||
                                    ''
                                }
                            />
                        </div>
                    </div>
                    <Form.Item>
                        <Button
                            style={{ marginRight: '10px', marginTop: '15px' }}
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Tạo mới
                        </Button>
                        <ButtonNavigator
                            url="/operating-system"
                            name="Quay lại"
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default CreateOperatingSystem
