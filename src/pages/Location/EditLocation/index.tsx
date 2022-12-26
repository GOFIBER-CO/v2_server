import { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import appConfig from '@/config/appConfig'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IArea from '@/interfaces/IArea'
import { createLocation, editLocation, getLocationById } from '@/services/apis'
import '@/styles/pages/Location/CreateLocation/index.scss'
import { Button, Form, Input, message, Select } from 'antd'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useParams } from 'react-router'

const { Option } = Select

const EditLocation = () => {
    const layout = useLayoutInit()
    const { id } = useParams()
    const [newLocation, setNewLocation] = useState<IArea>({
        areaName: '',
        country: '',
        status: 0,
        file: '',
        code: '',
    })

    const acceptFileType: string[] = [
        'image/gif',
        'image/jpeg',
        'image/png',
        'application/pdf',
        'image/jpeg',
        'image/png',
    ]
    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (acceptFileType.includes(e.target.files[0].type)) {
                setNewLocation({ ...newLocation, file: e.target.files[0] })
            } else {
                message.error('File này không được hỗ trợ')
            }
        }
    }

    const onFinished = async () => {
        try {
            layout.setLoading(true)
            const formdata = new FormData()
            formdata.append('areaName', newLocation.areaName)
            formdata.append('country', newLocation.country)
            formdata.append('status', newLocation.status.toString())
            formdata.append('file', newLocation.file)
            const create = await editLocation(id || '', formdata)
            if (create.data.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Cập nhật thành công')
            } else {
                notify(notifyType.NOTIFY_ERROR, create.data.message)
            }
        } catch (error) {
            notify(notifyType.NOTIFY_ERROR, error.response.data.message)
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    const getCurrentLocation = async () => {
        try {
            layout.setLoading(true)
            const result = await getLocationById(id || '')
            setNewLocation({
                ...newLocation,
                areaName: result.data?.areaName,
                country: result.data?.country,
                status: result.data?.status,
                file: result.data?.file,
            })
        } catch (error) {
            layout.setLoading(false)
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentLocation()
    }, [])

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
                        <span>Cập nhật khu vực</span>
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
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên khu vực',
                            },
                        ]}
                    >
                        <p>Tên khu vực:</p>
                        <Input
                            placeholder="Tên khu vực"
                            onChange={(e) =>
                                setNewLocation({
                                    ...newLocation,
                                    areaName: e.target.value,
                                })
                            }
                            value={newLocation.areaName}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập tên quốc gia!',
                            },
                        ]}
                    >
                        <p>Quốc gia:</p>
                        <Input
                            style={{ width: '100%' }}
                            type="price"
                            placeholder="Tên quốc gia"
                            onChange={(e) =>
                                setNewLocation({
                                    ...newLocation,
                                    country: e.target.value,
                                })
                            }
                            value={newLocation.country}
                        />
                    </Form.Item>
                    <p>Trạng thái:</p>
                    <Select
                        defaultValue="true"
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setNewLocation({
                                ...newLocation,
                                status: value == 'true' ? 0 : 1,
                            })
                        }
                        value={newLocation.status == 0 ? 'true' : 'false'}
                    >
                        <Option value="true">Hoạt động</Option>
                        <Option value="false">Dừng hoạt động</Option>
                    </Select>
                    <div className="create-location-page-input-image">
                        <p>Chọn file đính kèm: </p>
                        <input type={'file'} onChange={handleUploadFile} />
                        <div className="create-location-page-input-image-preview">
                            <img
                                src={
                                    (newLocation.file &&
                                        typeof newLocation.file != 'string' &&
                                        URL.createObjectURL(
                                            newLocation.file
                                        )) ||
                                    `${appConfig.API_URL_UPLOAD_FILES}/${newLocation.file}`
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
                        <ButtonNavigator url="/location" name="Quay lại" />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default EditLocation
