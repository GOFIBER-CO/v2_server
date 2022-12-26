import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import appConfig from '@/config/appConfig'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import {
    createOs,
    editOs,
    getAllOs,
    getOperatingSystemById,
} from '@/services/apis'
import '@/styles/pages/OperatingSystem/CreateOperatingSystem/index.scss'
import { Button, Form, Input, message, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useParams } from 'react-router'

const { Option } = Select

const EditOperatingSystem = () => {
    const { id } = useParams()
    const [operatingSystems, setOperatingSystem] =
        useState<IOperatingSystem[]>()
    const [currentOperatingSystem, setCurrentOperatingSystem] =
        useState<IOperatingSystem>({
            operatingSystemName: '',
            parentID: '',
            file: null,
            code: '',
            createdTime: '',
            children: [],
        })
    const layout = useLayoutInit()

    const getOperatingSystems = async () => {
        try {
            layout.setLoading(true)
            const result = await getAllOs()
            setOperatingSystem(result.data?.data)
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    const editOperatingSystem = async () => {
        try {
            layout.setLoading(true)
            const formdata = new FormData()
            formdata.append(
                'operatingSystemName',
                currentOperatingSystem.operatingSystemName
            )
            formdata.append('parentID', currentOperatingSystem.parentID || '')
            formdata.append('file', currentOperatingSystem.file || '')
            const create = await editOs(id || '', formdata)
            if (create.data?.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Cập nhật thành công')
            } else {
                notify(notifyType.NOTIFY_ERROR, 'Cập nhật thất bại')
            }
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    const onFinished = async () => {
        editOperatingSystem()
    }

    const getOperatingSystemWithId = async () => {
        try {
            layout.setLoading(true)
            const operatingSystem = await getOperatingSystemById(id || '')
            setCurrentOperatingSystem({
                ...currentOperatingSystem,
                operatingSystemName: operatingSystem.data?.operatingSystemName,
                parentID: operatingSystem.data?.parentID,
                file: operatingSystem.data?.file,
            })
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

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
                setCurrentOperatingSystem({
                    ...currentOperatingSystem,
                    file: e.target.files[0],
                })
            } else {
                message.error('File này không được hỗ trợ')
            }
        }
    }

    useEffect(() => {
        getOperatingSystems()
        getOperatingSystemWithId()
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
                        <span>Cập nhật hệ điều hành</span>
                    </li>
                </ul>
            </div>
            <div className="create-operating-system-page-input">
                <Form
                    style={{ marginTop: '25px' }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                        ['server_name']:
                            currentOperatingSystem.operatingSystemName,
                    }}
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
                                setCurrentOperatingSystem({
                                    ...currentOperatingSystem,
                                    operatingSystemName: e.target.value,
                                })
                            }
                            value={currentOperatingSystem.operatingSystemName}
                        />
                    </Form.Item>
                    <p className="create-operating-system-page-input-label">
                        Hệ điều hành cha:
                    </p>
                    <Select
                        defaultValue=""
                        value={currentOperatingSystem.parentID}
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setCurrentOperatingSystem({
                                ...currentOperatingSystem,
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
                                    currentOperatingSystem.file &&
                                    typeof currentOperatingSystem.file !=
                                        'string'
                                        ? URL.createObjectURL(
                                              currentOperatingSystem.file
                                          )
                                        : `${appConfig.API_URL_UPLOAD_FILES}/${currentOperatingSystem.file}`
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
                            Lưu
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

export default EditOperatingSystem
