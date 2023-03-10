import React, { useState } from 'react'
import '@/styles/pages/Service/index.scss'
import Overview from './Overview'
import NetworkInterfaces from './NetworkInterfaces'
import Storage from './Storage'
import Payment from './Payment'

type Props = {
    service: any
    vm: any
    handleRefreshVm: (vm: any) => void
}

const menu = [
    {
        id: 1,
        name: 'Tổng quan',
        value: 'overview',
    },
    {
        id: 3,
        name: 'Interfaces',
        value: 'interfaces',
    },
    // {
    //     id: 4,
    //     name: 'Firewall',
    //     value: 'firewall',
    // },
    {
        id: 5,
        name: 'Storage',
        value: 'storage',
    },
    // {
    //     id: 6,
    //     name: 'Snapshots',
    //     value: 'snapshots',
    // },
    // {
    //     id: 7,
    //     name: 'Nhật ký hệ thống',
    //     value: 'daily',
    // },
    // {
    //     id: 9,
    //     name: 'Resources',
    //     value: 'resources',
    // },
    // {
    //     id: 10,
    //     name: 'Network traffic',
    //     value: 'traffic',
    // },
    // {
    //     id: 11,
    //     name: 'ISO List',
    //     value: 'iso',
    // },
    {
        id: 12,
        name: 'Thanh toán',
        value: 'payment',
    },
]

function ServiceDetailPage({ service, vm, handleRefreshVm }: Props) {
    const [tab, setTab] = useState<string>(menu?.[0]?.value)

    const render = {
        overview: (
            <Overview
                handleRefreshVm={handleRefreshVm}
                vm={vm}
                service={service}
            />
        ),
        interfaces: <NetworkInterfaces vm={vm} service = {service}/>,
        storage: <Storage vm={vm} service = {service}/>,
        payment: <Payment service={service} />,
    }

    return (
        <div className="service-detail-page">
            <div className="domain" style={{ padding: '12px 0px 0px 12px' }}>
                {service?.domain}
            </div>
            <div className="row mt-4">
                <div className="col col-12 col-md-3">
                    <ul
                        className="ul m-0"
                        style={{ padding: '0px 0px 0px 12px' }}
                    >
                        {menu.map((item) => (
                            <li
                                onClick={() => setTab(item.value)}
                                className={`${
                                    tab === item.value ? 'active' : ''
                                }`}
                                key={item?.id}
                            >
                                <a>{item?.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col col-12 col-md-9">
                    {render[`${tab}` as 'overview' | 'interfaces']}
                </div>
            </div>
        </div>
    )
}

export default ServiceDetailPage
