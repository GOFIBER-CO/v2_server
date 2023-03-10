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
                notify(notifyType.NOTIFY_SUCCESS, 'C???p nh???t th??nh c??ng')
            } else {
                notify(notifyType.NOTIFY_ERROR, 'C???p nh???t th???t b???i')
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
                message.error('File n??y kh??ng ???????c h??? tr???')
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
                        <span>C???p nh???t h??? ??i???u h??nh</span>
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
                                message: 'H??y nh???p t??n h??? ??i???u h??nh',
                            },
                        ]}
                    >
                        <p className="create-operating-system-page-input-label">
                            T??n h??? ??i???u h??nh:
                        </p>
                        <Input
                            placeholder="T??n h??? ??i???u h??nh"
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
                        H??? ??i???u h??nh cha:
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
                            Ch???n h??? ??i???u h??nh cha (ch???n option n??y n???u ????y l?? h???
                            ??i???u h??nh cha)
                        </Option>
                        {operatingSystems?.map((item) => (
                            <Option key={item._id} value={`${item._id}`}>
                                {item.operatingSystemName}
                            </Option>
                        ))}
                    </Select>
                    <div className="create-operating-system-page-input-image">
                        <p>Ch???n file ????nh k??m: </p>
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
                            L??u
                        </Button>
                        <ButtonNavigator
                            url="/operating-system"
                            name="Quay l???i"
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditOperatingSystem
