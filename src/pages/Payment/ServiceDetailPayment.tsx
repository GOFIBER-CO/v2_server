import { getServiceDetailForPayment } from '@/services/apiv2'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '@/styles/pages/Payment/index.scss'
import { Divider } from 'antd'
import ConverMoney from '@/components/Conver/ConverMoney'
import { Link } from 'react-router-dom'

function ServiceDetailPayment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<{
        invoice?: any
        service?: any
        vm?: any
    }>({})

    const getServiceDetail = async (id: string) => {
        try {
            setIsLoading(true)
            const result = await getServiceDetailForPayment(id)

            const { data } = result?.data

            setData({
                invoice: data?.invoice || {},
                service: data?.service || {},
                vm: data?.vm || {},
            })
        } catch (error) {
            console.log('getServiceDetailForPayment', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) getServiceDetail(id)
    }, [id])

    const genCycle = (value: string) => {
        if (value === 'Monthly') return `( Hàng tháng )`

        return ``
    }

    const genStatus = (value: string) => {
        if (value === 'Pending') return `Đang chờ`

        return ``
    }

    const render = {
        loading: <div></div>,
        notLoading: (
            <div className="service-detail-for-payment">
                <div className="row">
                    <div className="col col-12 col-lg-3"></div>
                    <div className="col col-12 col-lg-9">
                        <h4>Thanh toán</h4>
                        <Divider />
                        <div className="row">
                            <div className="col col-12 col-lg-6">
                                <div className="info-item">
                                    <div>Ngày đăng ký</div>
                                    <div>{data?.invoice?.date}</div>
                                </div>
                                <div className="info-item">
                                    <div>Số tiền thanh toán định kỳ</div>
                                    <div>
                                        {ConverMoney(
                                            data?.invoice?.grandtotal
                                        ) || 0}{' '}
                                        đ{' '}
                                        {genCycle(data?.service?.billingcycle)}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div>Ngày hết hạn</div>
                                    <div style={{ color: 'red' }}>
                                        {data?.service?.expires}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div>Hoá đơn chưa thanh toán</div>
                                    <div>
                                        <Link to={'/'}>
                                            #{data?.invoice?.proforma_id}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col col-12 col-lg-6">
                                <div className="info-item">
                                    <div>Trạng thái</div>
                                    <div>
                                        {genStatus(data?.service?.status)}
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div>Hoá đơn tiếp theo</div>
                                    <div>{data?.service?.next_due}</div>
                                </div>
                                <div className="info-item">
                                    <div>OS Template</div>
                                    <div>{data?.vm?.template_name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
    }

    return <>{isLoading ? render['loading'] : render['notLoading']}</>
}

export default ServiceDetailPayment
