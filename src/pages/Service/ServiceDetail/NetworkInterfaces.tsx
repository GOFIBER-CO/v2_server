import React from 'react'

type Props = {
    vm: any,
    service: any
}

function NetworkInterfaces({ vm, service }: Props) {
    return (
        <div className="interfaces">
            <div>
                <h5>Server Details</h5>
            </div>
            <div className="content">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Model</th>
                            <th>MAC</th>
                            <th>Địa chỉ IP</th>
                            <th>Firewall</th>
                            <th>Bridge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vm?.interfaces ? Object.values(vm?.interfaces).map((item: any) => (
                            <tr key={item?.id}>
                                <td>{item?.name}</td>
                                <td>{item?.model}</td>
                                <td>{item?.mac}</td>
                                <td>{item?.ip?.[0]?.ip}</td>
                                <td>
                                    {item?.firewall === '1' ? 'Có' : 'Không'}
                                </td>
                                <td>{item?.bridge}</td>
                            </tr>
                        )) : 
                        service.interface?.map((item: any) => (
                            <tr key={item?.id}>
                                <td>{item?.name}</td>
                                <td>{item?.model}</td>
                                <td>{item?.mac}</td>
                                <td>{item?.ip}</td>
                                <td>
                                    {item?.firewall === '1' ? 'Có' : 'Không'}
                                </td>
                                <td>{item?.bridge}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NetworkInterfaces
