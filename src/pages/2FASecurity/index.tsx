import { notify, notifyType } from '@/App'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { disabled2fa, getUserQrCode, verify2FaToken } from '@/services/apis'
import '@/styles/pages/2FASecurity/index.scss'
import { Button, Divider, Form, Input, message, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { AiFillLock, AiFillUnlock } from 'react-icons/ai'
import { IoMdCopy } from 'react-icons/io'
import { toast } from 'react-toastify'

const FASecurity = () => {
    const [token, setToken] = useState('')
    const [qrcode, setQrcode] = useState('')
    const [secret, setSecret] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('')
    const [refetch, setRefetch] = useState(false)
  
    const handleOk = async () => {
      if(!password){
        toast.error('Phải nhập mật khẩu !')
        return;
      }
      try {
        const result = await disabled2fa(auth.user._id, password)
        toast.success(result.data.message)
        auth.setEnable2Fa(false)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data?.message)
      }
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const copyCode = () => {
        var copyText = document.getElementById('qr-code-text')?.innerText
        navigator.clipboard
            .writeText(copyText || '')
            .then(() => message.success('Đã copy QRCode'))
            .catch((err) => message.error(err))
    }

    const layout = useLayoutInit()
    const auth = useAuth()

    const verifyToken = async () => {
        try {
            layout.setLoading(true)
            const result = await verify2FaToken(auth.user._id, token)
            if (result.data.status == 1) {
                auth.setEnable2Fa(true)
                notify(notifyType.NOTIFY_SUCCESS, result.data.message)
            } else {
                notify(notifyType.NOTIFY_ERROR, result.data.message)
            }
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, error.response.data.message)
        } finally {
            layout.setLoading(false)
        }
    }

    const onFinish = () => {
        verifyToken()
    }

    const getQrCode = async () => {
        try {
            layout.setLoading(true)
            const result = await getUserQrCode(auth.user._id)
            setSecret(result.data.secret)
            setQrcode(result.data.qrcode)
            console.log(result.data)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        if (!auth.isEnable2FaAuthenticate) getQrCode()
    }, [auth.isEnable2FaAuthenticate])

    return (
        <div className="security-page">
            <div className="security-page-title">
                <p className="security-page-title-content">
                    Kích hoạt xác thực 2 yêu tố (2FA)
                </p>
            </div>
            <Divider style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }} />
            {!auth.isEnable2FaAuthenticate ? (
                <div className="security-page-content">
                    <p className="security-page-content-step">
                        Bước 1: Cài đặt ứng dụng xác thực OTP
                    </p>
                    <p className="security-page-content-note">
                        Bạn vui lòng cài đặt một trong các ứng dụng xác thực bên
                        dưới lên điện thoại của bạn.
                    </p>
                    <div className="security-page-content-otp">
                        <div className="security-page-content-otp-authenticator">
                            <div className="security-page-content-otp-authenticator-image">
                                <img
                                    src="/images/googleauthenticator.png"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <p className="security-page-content-otp-authenticator-name">
                                Google Authenticator
                            </p>
                        </div>
                        <div className="security-page-content-otp-authenticator">
                            <div className="security-page-content-otp-authenticator-image">
                                <img
                                    src="/images/microsoftauthenticator.png"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <p className="security-page-content-otp-authenticator-name">
                                Microsoft Authenticator
                            </p>
                        </div>
                        <div className="security-page-content-otp-authenticator">
                            <div className="security-page-content-otp-authenticator-image">
                                <img
                                    src="/images/twilio.png"
                                    width={80}
                                    height={80}
                                />
                            </div>
                            <p className="security-page-content-otp-authenticator-name">
                                Twilio Authy
                            </p>
                        </div>
                    </div>
                    <p className="security-page-content-step">
                        Bước 2: Quét mã QR
                    </p>
                    <p className="security-page-content-note">
                        Quét mã QR bên dưới bằng ứng dụng bạn đã cài đặt ở bước
                        1 (Nếu không thể quyết mã QR, bạn có thể copy và nhập
                        khoá cài đặt vào ứng dụng)
                    </p>
                    <div className="security-page-content-otp-authenticator-qrcode">
                        <img src={qrcode} width={150} height={150} />
                        <p
                            id="qr-code-text"
                            className="security-page-content-otp-authenticator-qrcode-copy"
                        >
                            {secret}{' '}
                            <IoMdCopy
                                onClick={() => copyCode()}
                                size={20}
                                style={{
                                    verticalAlign: '-4px',
                                    marginLeft: '10px',
                                    border: '1px solid gray',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            />
                        </p>
                    </div>
                    <p className="security-page-content-step">
                        Bước 3: Nhập mã xác nhận
                    </p>
                    <p className="security-page-content-note">
                        Bạn vui lòng copy mã xác nhận được sinh ra trên ứng dụng
                        đã cài đặt.
                    </p>
                    <Form onFinish={onFinish}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Hãy nhập mã',
                                },
                            ]}
                        >
                            <Input
                                style={{ width: '25%', marginLeft: '10px' }}
                                placeholder="Mã xác thực"
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <Button
                                htmlType="submit"
                                className="security-page-content-button-qrcode"
                                style={{
                                    backgroundColor: '#1bc5bd',
                                    color: 'white',
                                    display: 'flex',
                                    marginLeft: '10px',
                                    marginTop: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                }}
                            >
                                <AiFillLock
                                    size={20}
                                    style={{ marginRight: '10px' }}
                                    color="white"
                                />
                                Kích hoạt xác thực 2 yếu tố
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) : (
                <>
                <p>Chế độ xác thực 2 yếu tố đã được bật</p>
                <Button
                htmlType="submit"
                className="security-page-content-button-qrcode"
                style={{
                    backgroundColor: '#1bc5bd',
                    color: 'white',
                    display: 'flex',
                    marginTop: '10px',
                    borderRadius: '8px',
                    border: 'none',
                }}
                onClick={()=>setIsModalOpen(true)}
                >
                    <AiFillUnlock
                        size={20}
                        style={{ marginRight: '10px', verticalAlign: '-2px' }}
                        color="white"
                    />
                    Tắt xác thực 2 yếu tố
                </Button>
            </>
            )}
               <Modal title="Tắt xác thực 2 yếu tố" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Input value={password} onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Nhập mật khẩu để tắt xác thực 2 yếu tố'/>
             </Modal>
        </div>
    )
}

export default FASecurity
