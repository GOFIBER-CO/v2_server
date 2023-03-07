import ConverMoney from '@/components/Conver/ConverMoney'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

function PaymentForService() {
    const state = useLocation().state

    const navigate = useNavigate()

    useEffect(() => {
        if (!state) {
            navigate('/cloud-vps')
        }
    }, [])

    return (
        <div style={{ marginTop: '32px' }}>
            <div className="row mt-4 align-items-center">
                <div className="col-12 col-lg-6 mt-4">
                    <div className="d-flex justify-content-center">
                        <img
                            src={`https://manager.idcviettel.com/vietqr.php?account=${state?.account}&bankcode=${state?.bankcode}&amount=${state.amount}&noidung=${state?.noidung}`}
                            style={{
                                height: '200px',
                                maxWidth: '200px',
                                border: '1px solid #ccc',
                            }}
                        />
                    </div>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                    <div
                        className="d-flex justify-content-center align-items-center flex-column"
                        style={{ fontWeight: '400', fontSize: '18px' }}
                    >
                        <div>Số tài khoản: {state?.account}</div>
                        <div>Chủ tài khoản: Nguyễn Trung Hiếu</div>
                        <div>Nội dung thanh toán: {state?.noidung}</div>
                        <div>Số tiền: {ConverMoney(state?.amount || 0)}</div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center" style={{ fontSize: '18px' }}>
                <i>
                    Quý khách vui lòng điền đúng số hoá đơn và số tiền hoặc quét
                    mã QR để thanh toán được xác nhận tự động.
                </i>
            </div>
        </div>
    )
}

export default PaymentForService
