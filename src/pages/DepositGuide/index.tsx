import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IDepositGuide from '@/interfaces/IDepositGuide'
import { getDepositGuide } from '@/services/apis'
import '@/styles/pages/DepositGuide/DepositGuide.scss'
import { Image } from 'antd'
import { useEffect, useState } from 'react'

const DepositGuide: React.FC = () => {
    const [depositGuide, setDepositGuide] = useState<IDepositGuide>({
        _id: '',
        content: '',
    })

    const layout = useLayoutInit()

    const getContentDepositGuide = async () => {
        try {
            layout.setLoading(true)
            const result = await getDepositGuide()
            setDepositGuide(result.data)
            layout.setLoading(false)
        } catch (error) {
            layout.setLoading(false)
            console.log(error)
        }
    }

    const auth = useAuth()

    useEffect(() => {
        getContentDepositGuide()
    }, [])
    return (
        <div className="deposit-guide">
            <p className="deposit-guide-title">Nạp tiền vào tài khoản</p>
            <div className="row align-items-center">
                <div className="col-12 col-lg-6 mt-4">
                    <div className="d-flex justify-content-center">
                        <Image
                            style={{
                                height: '250px',
                                maxWidth: '250px',
                                border: '1px solid #ccc',
                            }}
                            src='/images/qr-acb.gif' />
                    </div>
                    <p className="extra text-center mt-2">(Click để phóng to)</p>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                    <div
                        className="d-flex justify-content-center align-items-center flex-column"
                        style={{ fontWeight: '400', fontSize: '18px' }}
                    >
                        <div>Số tài khoản: 5318731</div>
                        <div>Chủ tài khoản: Nguyễn Trung Hiếu</div>
                        <div style={{ textAlign: 'center' }}>Nội dung thanh toán: {`Chuyen tien vao tai khoan ${auth.user?.client_id}`}</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center" style={{ fontSize: '18px' }}>
                <i>
                    Quý khách vui lòng điền đúng số hoá đơn và số tiền hoặc
                    quét mã QR để thanh toán được xác nhận tự động.
                </i>
            </div>
        </div>
    )
}

export default DepositGuide
