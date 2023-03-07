import React from 'react'

type Props = {
    vm: any
}

function Storage({ vm }: Props) {
    return (
        <div className="storage">
            <div>
                <h5>Storage</h5>
            </div>
            <div className="content">
                <table>
                    <thead>
                        <tr>
                            <th>Bus/device</th>
                            <th>Kích thước</th>
                            <th>Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(vm?.storage).map((item: any) => (
                            <tr key={item?.name}>
                                <td>{item?.name}</td>
                                <td>{item?.size_gb} GB</td>
                                <td>{item?.zone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Storage
