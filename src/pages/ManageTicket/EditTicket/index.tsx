//@ts-nocheck

import App, { notify, notifyType } from '@/App'
import ButtonNavigator from '@/components/ButtonNavigator'
import appConfig from '@/config/appConfig'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITicket from '@/interfaces/ITicket'
import { getTicketById ,updateTicket} from '@/services/apiv2'
import '@/styles/pages/ManageTicket/EditTicket/index.scss'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

const { Option } = Select

const EditTicket = () => {
    const [status, setStatus] = useState('')
    const [feedBack, setFeedBack] = useState('')
    const [support, setSupport] = useState<ITicket>()
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
            const dataRef =  {
                modifiedUser: auth?.user?.id,
                feedBack: feedBack,
                status: status,
                // userId: support.user._id,
            } as any
            
            const result = await updateTicket(support?._doc?._id as string, dataRef)
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
                    Tiêu đề: {support?._doc?.subject}
                </h2>
                <p>
                    Email người gửi:{' '}
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        {support?.email}
                    </span>
                </p>
                <p>
                    Ngày gửi:{' '}
                    <span
                        style={{ fontWeight: 600, fontSize: '16px' }}
                    >{`${new Date(support?._doc?.updatedAt).getDate()}-${new Date(
                        support?._doc?.createdAt
                    ).getMonth()}-${new Date(
                        support?._doc?.createdAt
                    ).getFullYear()}`}</span>
                </p>
                <p>
                    File đính kèm:{' '}
                    <a
                        target={'_blank'}
                        href={`${appConfig.API_URL_UPLOAD_FILES1}/${support?._doc?.file}`}
                    >
                        {support?._doc?.file}
                    </a>
                </p>
                <p>
                    {' '}
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        Nội dung:
                    </span>
                </p>
                <p dangerouslySetInnerHTML={{ __html: support?._doc?.body } }></p>
                <div className="edit-ticket-page-feed-back">
                    <div className="edit-ticket-form-input-status">
                        <p>Trạng thái: </p>
                        <Select
                            // defaultValue={support?._doc?.level}
                            // value={support?._doc?.level}
                            style={{ width: '15%' }}
                            onChange={(value) => setStatus(value)}
                        >
                            <Option value="0">Chưa xác nhận</Option>
                            <Option value="2">Xác nhận</Option>
                            <Option value="1">Hoàn thành</Option>
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
