import ConverMoney from '@/components/Conver/ConverMoney'
import formatMoney from '@/helpers/formatMoney'
import { Divider } from 'antd'
import moment from 'moment'
import React from 'react'

type Props = {
    service: any
}

function Payment({ service }: Props) {
    const genCycle = (value: string) => {
        if (value === 'Monthly') return `( Hàng tháng )`

        return ``
    }

    const genStatus = (value: string) => {
        if (value === 'Active') return `Hoạt động`
        return ``
    }

    return (
        <div className="row">
            <div className="col col-12 col-lg-3"></div>
            <div className="col col-12 col-lg-9">
                <h4>Thanh toán</h4>
                <Divider />
                <div className="row">
                    <div className="col col-12 col-lg-6">
                        <div className="info-item">
                            <div>Ngày đăng ký</div>
                            <div>{service?.date_created || moment(service?.bill.createdAt).format("DD-MM-YYYY")}</div>
                        </div>
                        <div className="info-item">
                            <div>Số tiền thanh toán định kỳ</div>
                            {
                                service?.total ?  <div>
                                    {ConverMoney(Number(service?.total)) || 0} đ{' '}
                                    {genCycle(service?.billingcycle)}
                                </div> : 
                                <div>
                                    {formatMoney(service?.price || 0)}
                                </div> 
                            }
                           
                        </div>
                        <div className="info-item">
                            <div>Ngày hết hạn</div>
                            <div style={{ color: 'red' }}>
                                {service?.expires || moment(new Date(service?.expireDate)).format("DD-MM-YYYY")}
                            </div>
                        </div>
                    </div>
                    <div className="col col-12 col-lg-6">
                        <div className="info-item">
                            <div>Trạng thái</div>
                            <div>{genStatus(service?.status) || "Hoạt động"}</div>
                        </div>
                        <div className="info-item">
                            <div>Hoá đơn tiếp theo</div>
                            <div>{service?.next_invoice || moment(service?.bill.createdAt).add(1, 'M').format("DD-MM-YYYY")}</div>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div>
                        {genDescription(
                            data?.invoice?.items?.[0]?.description
                        ).map((item: any) => (
                            <div className="line-item" key={item}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Payment
