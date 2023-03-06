import { convertByteToMB, timeCalculator } from '@/helpers'
import { Button, Popover, Switch } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'

type Props = {
    service: any
    vm: any
}

function Overview({ service, vm }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const genIP = () => {
        return Object.values(vm?.ip)?.[0] as any
    }

    return (
        <div className="overview">
            <div className="d-flex align-items-center justify-content-between">
                <h5>Server Details</h5>
                <div>
                    <Button type="default">Console</Button>
                    <Button type="default">Reboot</Button>
                    <Button type="default">Shutdown</Button>
                    <Button type="default">More</Button>
                </div>
            </div>
            <div className="content">
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Trạng thái</div>
                            <Switch
                                checkedChildren="Bật"
                                unCheckedChildren="Tắt"
                                defaultChecked
                            />
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Tên miền/ Hostname</div>
                            <div>{service?.domain}</div>
                        </div>
                    </div>
                </div>
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Tên đăng nhập</div>
                            <div>root</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Mật khẩu</div>
                            {showPassword ? (
                                <div>{vm?.password}</div>
                            ) : (
                                <a
                                    onClick={() => setShowPassword(true)}
                                    className="text-danger"
                                >
                                    Hiện
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="view-item">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>IP</div>
                            <div className="d-flex">
                                <Popover
                                    content={
                                        <div>
                                            <div className="text-center">
                                                Main IP for net
                                            </div>
                                            <div className="mt-2">
                                                Mạng: {genIP()?.network}
                                            </div>
                                            <div className="mt-2">
                                                Gateway: {genIP()?.gateway}
                                            </div>
                                        </div>
                                    }
                                >
                                    <div
                                        style={{
                                            borderBottom: '1px dashed #000',
                                        }}
                                    >
                                        {genIP()?.ip}
                                    </div>
                                </Popover>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Uptime</div>
                            <div>{timeCalculator(vm?.uptime || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content">
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Operating System</div>
                            <div>{vm?.template_name}</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Bandwidth</div>
                            <div>
                                <span>
                                    IN:{' '}
                                    {convertByteToMB(
                                        vm?.bandwidth?.data_received || 0
                                    )}
                                </span>
                                <span style={{ marginLeft: '12px' }}>
                                    OUT:{' '}
                                    {convertByteToMB(
                                        vm?.bandwidth?.data_sent || 0
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Dung lượng lưu trữ</div>
                            <div>{vm?.disk} GB</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>RAM</div>
                            <div>{vm?.memory}</div>
                        </div>
                    </div>
                </div>

                <div className="view-item">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>CPU(s)</div>
                            <div>{vm?.cpus} Cores</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview
