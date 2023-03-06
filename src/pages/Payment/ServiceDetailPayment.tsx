import { getServiceDetailForPayment } from '@/services/apiv2'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '@/styles/pages/Payment/index.scss'
import { Divider } from 'antd'
import ConverMoney from '@/components/Conver/ConverMoney'
import { Link } from 'react-router-dom'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ServiceDetailPage from '../Service/ServiceDetail'

function ServiceDetailPayment() {
    const { id } = useParams()
    const layout = useLayoutInit()
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
            layout.setLoading(true)
            const result = await getServiceDetailForPayment(id)

            const { data } = result?.data
            console.log('data', data)
            setData({
                invoice: data?.invoice || {},
                service: data?.service || {},
                vm: data?.vm || {},
            })
        } catch (error) {
            console.log('getServiceDetailForPayment', error)
        } finally {
            layout.setLoading(false)
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
        else if (value === 'Terminated') return `Đã xóa`
        return ``
    }

    const genDescription = (description: string) => {
        if (!description) return []

        return description?.split('\n + ')
    }

    const renderByStatus = {
        active: (
            <ServiceDetailPage
                service={data?.service}
                invoice={data?.invoice}
                vm={data?.vm}
            />
        ),
        inactive: (
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
                                    {ConverMoney(data?.service?.total) || 0} đ{' '}
                                    {genCycle(data?.service?.billingcycle)}
                                </div>
                            </div>
                            <div className="info-item">
                                <div>Ngày hết hạn</div>
                                <div style={{ color: 'red' }}>
                                    {data?.service?.next_due}
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-lg-6">
                            <div className="info-item">
                                <div>Trạng thái</div>
                                <div>{genStatus(data?.service?.status)}</div>
                            </div>
                            <div className="info-item">
                                <div>Hoá đơn tiếp theo</div>
                                <div>{data?.service?.next_due}</div>
                            </div>
                            {data?.service?.status !== 'Terminated' && (
                                <div className="info-item">
                                    <div>Hoá đơn chưa thanh toán</div>
                                    <div>
                                        <Link
                                            to={`/invoice-detail/${data?.invoice?.id}`}
                                        >
                                            #{data?.invoice?.proforma_id}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            {genDescription(
                                data?.invoice?.items?.[0]?.description
                            ).map((item: any) => (
                                <div className="line-item" key={item}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
    }

    const render = {
        loading: <div></div>,
        notLoading: (
            <div className="service-detail-for-payment">
                {data?.service?.status === 'Active'
                    ? renderByStatus['active']
                    : renderByStatus['inactive']}
            </div>
        ),
    }

    return <>{isLoading ? render['loading'] : render['notLoading']}</>
}

export default ServiceDetailPayment
