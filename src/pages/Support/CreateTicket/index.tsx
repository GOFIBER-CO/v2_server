
//@ts-nocheck
import '@/styles/pages/SupportPage/CreateTicket/CreateTicket.scss'
import { Button, message, Select, Upload, UploadProps } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { TfiMenuAlt } from 'react-icons/tfi'
import { Editor } from '@tinymce/tinymce-react'
import React, { useEffect, useRef, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { AiOutlinePlus } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import IProcessingRoom from '@/interfaces/IProcessingRoom'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import {  getProcessingRoom } from '@/services/apis'
import ITicketCreate from '@/interfaces/ITicketCreate'
import { notify, notifyType } from '@/App'
import { useAuth } from '@/hooks/useAuth'
import { createNewTicket, getAllDepartments } from '@/services/apiv2'

const { Option } = Select

const CreateTicket: React.FC = () => {
    const [processingRooms, setProcessingRooms] = useState<IProcessingRoom[]>(
        []
    )
    const auth = useAuth()

    let userId= auth.user?.id
  
    
    const editorRef = useRef(null)
    const [description, setDescription] = useState('')
    const navigate = useNavigate()
    const [newTicket, setNewTicket] = useState<ITicketCreate>({
        level: 1,
        processingRoom: '',
        title: '',
        content: '',
        user: '',
        file: null,
    })

    
    const layout = useLayoutInit()

    const handleChangeDescription = (value: string) => {
        setNewTicket({ ...newTicket, content: value })
    }

    const createTicket = () => {
        console.log('created')
    }

    const turnBack = () => {
        navigate('/support')
    }

    const getAllProcessingRoom = async () => {
        try {
            layout.setLoading(true)
            const result = await getAllDepartments()
           
            
            setProcessingRooms(result.data?.data)
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
    ]

    const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (acceptFileType.includes(e.target.files[0].type)) {
                setNewTicket({ ...newTicket, file: e.target.files[0] })
            } else {
                message.error('File n??y kh??ng ???????c h??? tr???')
            }
        }
    }

    const onCreateTicket = async () => {
        const data = new FormData
        data.append('level', newTicket.level.toString())
        data.append('subject', newTicket.title || '')
        data.append('body', newTicket.content || '')
        data.append('user', userId)
        data.append('file', newTicket.file ? newTicket.file : '')
        data.append('dept_id', newTicket.processingRoom)
        
       
        try {
            layout.setLoading(true)
            const result =  await createNewTicket(data)
            if (result.data) {
                notify(notifyType.NOTIFY_SUCCESS, 'T???o ticket th??nh c??ng!')
            } else {
                notify(
                    notifyType.NOTIFY_ERROR,
                    'T???o ticket th???t b???i, c?? l???i trong qu?? tr??nh t???o'
                )
            }
        } catch (error) {
            console.log(error)
            notify(
                notifyType.NOTIFY_ERROR,
                'T???o ticket th???t b???i, c?? l???i trong qu?? tr??nh t???o'
            )
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getAllProcessingRoom()
    }, [])

    return (
        <div className="create-ticket-form">
            <div className="create-ticket-form-header">
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
                        <span>Th??m m???i ticket</span>
                    </li>
                </ul>
            </div>
            <div className="create-ticket-form-input">
                <div className="create-ticket-form-input-level">
                    <p>M???c ????? ??u ti??n: </p>
                    <Select
                        defaultValue="1"
                        style={{ width: '100%' }}
                        onChange={(value) =>
                            setNewTicket({ ...newTicket, level: Number(value) })
                        }
                    >
                        <Option value="1">B??nh th?????ng</Option>
                        <Option value="2">??u ti??n</Option>
                        <Option value="3">Kh???n c???p</Option>
                    </Select>
                </div>
                <div className="create-ticket-form-input-room">
                    <p>Ph??ng x??? l??: </p>
                    <Select
                        style={{ width: '100%' }}
                        onChange={(e) =>
                            setNewTicket({
                                ...newTicket,
                                processingRoom: e ,
                            })
                        }
                    >
                        
                        {processingRooms.map((item) => (
                            <Option key={item._id} value={item._id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="create-ticket-form-input-title">
                    <p>Ti??u ?????: </p>
                    <TextArea
                        onChange={(e) =>
                            setNewTicket({
                                ...newTicket,
                                title: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="create-ticket-form-input-description">
                    <p>N???i dung y??u c???u: </p>
                    <Editor
                        apiKey='4ew8r9zwybqtimaz9nlyr048mdv0q5m34o57nekuzolm5kxn'
                        value={newTicket.content}
                        onEditorChange={handleChangeDescription}
                    />
                </div>
                <div className="create-ticket-form-input-file">
                    <p>Ch???n file ????nh k??m: </p>
                    <input type={'file'} onChange={handleUploadFile} />
                    <p style={{ marginTop: '8px' }}>
                        C??c lo???i file ???????c h??? tr??? .gif, .jpeg, .jpg, .png, .pdf
                    </p>
                </div>
            </div>
            <div className="create-ticket-form-button">
                <Button
                    icon={<AiOutlinePlus style={{ verticalAlign: '-2px' }} />}
                    style={{
                        backgroundColor: '#1bc5bd',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                    }}
                    onClick={() => onCreateTicket()}
                >
                    T???o m???i
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
                    Quay l???i
                </Button>
            </div>
        </div>
    )
}

export default CreateTicket
