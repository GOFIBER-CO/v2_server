import { Button, Result } from 'antd'
import React, { useEffect } from 'react'
import Confetti from 'react-confetti'
import { useLocation, useNavigate } from 'react-router'

function SuccessPayment() {
    const state = useLocation().state
    const navigate = useNavigate()

    useEffect(() => {
        if (!state?.invoiceId) {
            navigate('/')
        }
    }, [state])

    return (
        <div style={{ overflow: 'hidden' }}>
            <Confetti
                style={{ width: '100%', height: '100%' }}
                numberOfPieces={1000}
            />
            <Result
                status="success"
                title="Thanh toán hóa đơn thành công"
                subTitle="Vui lòng đợi hệ thống xử lý trong giây lát."
            />
        </div>
    )
}

export default SuccessPayment
