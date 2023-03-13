import { RESPONSE_STATUS } from '@/helpers'
import { socket } from '@/socket'
import { Button, Result } from 'antd'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function WaitingPayment() {
    const state = useLocation().state
    const navigate = useNavigate()

    useEffect(() => {
        socket.on('response payment', (data) => {
            const { status, invoiceId } = data
            if (status === RESPONSE_STATUS.SUCCESS) {
                navigate('/payment/success', {
                    state: {
                        invoiceId,
                    },
                })
            }
        })
    }, [])

    const handleRedirect = () => {
        window.open(state?.redirect || '/')
    }

    return (
        <div>
            <Result
                title={`Thực hiện thanh toán cho hóa đơn: ${state?.proforma_id}`}
                extra={
                    <Button
                        onClick={handleRedirect}
                        type="primary"
                        key="console"
                    >
                        Thanh toán tại đây
                    </Button>
                }
            />
        </div>
    )
}

export default WaitingPayment
