import ConverMoney from '@/components/Conver/ConverMoney'
import { Divider } from 'antd'
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
                            <div>{service?.date_created}</div>
                        </div>
                        <div className="info-item">
                            <div>Số tiền thanh toán định kỳ</div>
                            <div>
                                {ConverMoney(Number(service?.total)) || 0} đ{' '}
                                {genCycle(service?.billingcycle)}
                            </div>
                        </div>
                        <div className="info-item">
                            <div>Ngày hết hạn</div>
                            <div style={{ color: 'red' }}>
                                {service?.expires}
                            </div>
                        </div>
                    </div>
                    <div className="col col-12 col-lg-6">
                        <div className="info-item">
                            <div>Trạng thái</div>
                            <div>{genStatus(service?.status)}</div>
                        </div>
                        <div className="info-item">
                            <div>Hoá đơn tiếp theo</div>
                            <div>{service?.next_invoice}</div>
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
