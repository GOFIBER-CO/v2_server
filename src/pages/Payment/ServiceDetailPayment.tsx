import { getServiceDetailForPayment } from '@/services/apiv2'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '@/styles/pages/Payment/index.scss'
import { Divider } from 'antd'
import ConverMoney from '@/components/Conver/ConverMoney'
import { Link } from 'react-router-dom'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ServiceDetailPage from '../Service/ServiceDetail'
import { useAuth } from '@/hooks/useAuth'
import { dataservice } from '@/helpers/dataservices'
import moment from 'moment'

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

    const auth = useAuth()

    const getDetailServiceClientId22 = () => {
        return dataservice.find(x => x.id == Number(id))
    }

    const getServiceDetail = async (id: string) => {
        try {
            setIsLoading(true)
            layout.setLoading(true)
            const result = await getServiceDetailForPayment(id)

            const { data } = result?.data
            console.log(data)
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

    const handleRefreshVm = (vm: any) => {
        setData((prevState) => {
            return {
                ...prevState,
                vm,
            }
        })
    }

    const renderByStatus = {
        active: (
            <ServiceDetailPage
                handleRefreshVm={handleRefreshVm}
                service={Number(auth.user?.client_id) == 22 ? getDetailServiceClientId22() : data?.service}
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
                                <div>{Number(auth.user?.client_id) == 22 ? moment(getDetailServiceClientId22()?.bill.createdAt).format("DD-MM-YYYY") : data?.service?.date_created}</div>
                            </div>
                            <div className="info-item">
                                <div>Số tiền thanh toán định kỳ</div>
                                <div>
                                    {Number(auth.user?.client_id) == 22 ? ConverMoney(getDetailServiceClientId22()?.price) : ConverMoney(
                                        Number(data?.service?.total)
                                    ) || 0}{' '}
                                    đ {genCycle(data?.service?.billingcycle)}
                                </div>
                            </div>
                            <div className="info-item">
                                <div>Ngày hết hạn</div>
                                <div style={{ color: 'red' }}>
                                    {Number(auth.user?.client_id) == 22 ? moment(getDetailServiceClientId22()?.bill.exipireDate).format("DD-MM-YYYY") : data?.service?.expires}
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-lg-6">
                            <div className="info-item">
                                <div>Trạng thái</div>
                                <div>{Number(auth.user?.client_id) == 22 ? genStatus("Pending") : genStatus(data?.service?.status)}</div>
                            </div>
                            <div className="info-item">
                                <div>Hoá đơn tiếp theo</div>
                                <div>{data?.service?.next_invoice}</div>
                            </div>
                            {data?.service?.status !== 'Terminated' && (
                                <div className="info-item">
                                    <div>Hoá đơn chưa thanh toán</div>
                                    <div>
                                        <Link
                                            to={`/invoice-detail/${data?.invoice?.id}`}
                                        >
                                            {Number(auth.user?.client_id) == 22 ? getDetailServiceClientId22()?.bill.number : `#${data?.invoice?.proforma_id}`}
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

    return <>{Number(auth.user?.client_id) == 22 ? <div className="service-detail-for-payment">
        {getDetailServiceClientId22()?.status == 'paid' ? renderByStatus['active'] : renderByStatus['inactive']}
    </div>:  (isLoading ? render['loading'] : render['notLoading'])}</>
}

export default ServiceDetailPayment
