import { momoPay, receiveRequestVNPAY } from '@/services/apiv2'
import { Modal } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import PaymentMethod from '../CloudVPS/PaymentMethod'

type Props = {
    visible: boolean
    invoice: any
    handleClose: () => void
}

const paymentMethods = [
    {
        object_id: 14,
        name: 'Cổng thanh toán VNPAY',
        image: 'https://vnpay.vn/_nuxt/img/logo-primary.55e9c8c.svg',
    },
    {
        object_id: 15,
        name: 'Ví điện tử MoMo',
        image: 'https://cdn.tgdd.vn/2020/03/GameApp/Untitled-2-200x200.jpg',
    },
]

//phân loại thanh toán trên FE
const PAYMENT_TYPE = {
    // theo từng order
    ONE_ORDER: 'ONE_ORDER',
}

function ModalPayment({ invoice, visible, handleClose }: Props) {
    const [chosenPayment, setChosenPayment] = useState(paymentMethods[0])
    const navigate = useNavigate()

    // Xử lí xác nhận tạo function riêng cho từng phương thức thanh toán
    // và bỏ vào function handleConfirm
    const handleConfirm = () => {
        // VNPAY
        if (chosenPayment?.object_id === 14) {
            handlePaymentVNPAY()
        }
        if(chosenPayment.object_id === 15){
            handleMomoPay()
        }
    }

    const handleMomoPay = async () => {
        try {
            const result = await momoPay({id: invoice.id})
            if(result.data?.status === 1){
                window.open(result.data?.url, "_blank")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePaymentVNPAY = async () => {
        const { total, proforma_id, id } = invoice
        const params = {
            total,
            proforma_id,
            invoice_id: id,
        }

        const result = await receiveRequestVNPAY(params)

        const { proforma_id: proforma_idRes, redirect } = result?.data?.data

        navigate('/payment/waiting', {
            state: {
                proforma_id: proforma_idRes,
                redirect,
            },
        })
    }

    return (
        <Modal
            title="Chọn phương thức thanh toán"
            open={visible}
            cancelText={'Hủy bỏ'}
            okText="Thanh toán"
            onCancel={handleClose}
            onOk={handleConfirm}
        >
            {paymentMethods?.map((item, index) => (
                <PaymentMethod
                    data={item}
                    isCheck={Boolean(
                        chosenPayment.object_id === item?.object_id
                    )}
                    onchangeItem={() => setChosenPayment(item)}
                />
            ))}
        </Modal>
    )
}

export default ModalPayment
