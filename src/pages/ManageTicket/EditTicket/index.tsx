import App, { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import appConfig from '@/config/appConfig'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getTicketById, updateTicket } from '@/services/apis'
import '@/styles/pages/ManageTicket/EditTicket/index.scss'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

const { Option } = Select

const EditTicket = () => {
    const [status, setStatus] = useState(0)
    const [feedBack, setFeedBack] = useState('')
    const [support, setSupport] = useState<ITicket>({
        _id: '',
        title: '',
        content: '',
        level: 1,
        user: {
            _id: '',
            email: '',
        },
        status: 1,
        supportName: '',
        processingRoom: {
            processingRoomName: '',
        },
        createdTime: '',
        file: '',
        feedBack: '',
        modifiedBy: {
            email: '',
        },
        updatedTime: '',
        code: '',
    })
    const layout = useLayoutInit()
    const auth = useAuth()
    const { id } = useParams()
    const getSupport = async () => {
        try {
            layout.setLoading(true)
            const result = await getTicketById(id || '')
            setSupport(result.data)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const onSubmit = async () => {
        try {
            layout.setLoading(true)
            const result = await updateTicket(support._id, {
                modifiedUser: auth.user._id,
                feedBack: feedBack,
                status: status,
                userId: support.user._id,
            })
            if (result.data.status == 1) {
                notify(notifyType.NOTIFY_SUCCESS, 'Cập nhật thành công')
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

    useEffect(() => {
        getSupport()
    }, [])
    return (
        <div className="edit-ticket-page">
            <div className="edit-ticket-page-header">
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
                        <span>Quản lý ticket</span>
                    </li>
                </ul>
            </div>
            <div className="edit-ticket-page-content">
                <h2 className="edit-ticket-page-content-title">
                    Tiêu đề: {support.title}
                </h2>
                <p>
                    Email người gửi:{' '}
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        {support.user?.email}
                    </span>
                </p>
                <p>
                    Ngày gửi:{' '}
                    <span
                        style={{ fontWeight: 600, fontSize: '16px' }}
                    >{`${new Date(support.createdTime).getDate()}-${new Date(
                        support.createdTime
                    ).getMonth()}-${new Date(
                        support.createdTime
                    ).getFullYear()}`}</span>
                </p>
                <p>
                    File đính kèm:{' '}
                    <a
                        target={'_blank'}
                        href={`${appConfig.API_URL_UPLOAD_FILES}/${support.file}`}
                    >
                        {support.file}
                    </a>
                </p>
                <p>
                    {' '}
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        Nội dung:
                    </span>
                </p>
                <p dangerouslySetInnerHTML={{ __html: support.content }}></p>
                <div className="edit-ticket-page-feed-back">
                    <div className="edit-ticket-form-input-status">
                        <p>Trạng thái: </p>
                        <Select
                            defaultValue={support.status}
                            style={{ width: '15%' }}
                            onChange={(value) => setStatus(Number(value))}
                        >
                            <Option value={0}>Chưa xác nhận</Option>
                            <Option value={1}>Xác nhận</Option>
                            <Option value={2}>Hoàn thành</Option>
                        </Select>
                    </div>
                    <div
                        className="edit-ticket-form-input-feedback"
                        style={{ marginTop: '20px' }}
                    >
                        <p>Phản hồi: </p>
                        <Editor
                            value={feedBack}
                            onEditorChange={(value) => setFeedBack(value)}
                        />
                    </div>
                    <div
                        className="edit-ticket-form-input-button"
                        style={{ marginTop: '20px' }}
                    >
                        <Button type="primary" onClick={() => onSubmit()}>
                            Cập nhật
                        </Button>
                        <ButtonNavigator url="/manage-ticket" name="Quay lại" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTicket
