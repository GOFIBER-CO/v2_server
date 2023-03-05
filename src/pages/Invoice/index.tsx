import React, { useEffect, useState } from 'react'
import '@/styles/pages/Invoice/index.scss'
import { getAllInvoices } from '@/services/apiv2'

function InvoicePage() {
    const [invoices, setInvoices] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getInvoices = async () => {
        try {
            const result = await getAllInvoices()

            const { data } = result?.data

            console.log('data', data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getInvoices()
    }, [])

    return (
        <div className="invoice-page">
            <div className="d-flex align-items-center justify-content-between">
                <h4>Hóa đơn</h4>
                <div className="d-flex align-items-center">
                    <div style={{ marginRight: '12px' }} className="money-item">
                        <div className="money red">100đ</div>
                        <div className="extra">Hóa đơn đến hạn</div>
                    </div>
                    <div className="money-item">
                        <div className="money green">100đ</div>
                        <div className="extra">Tín dụng</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoicePage
