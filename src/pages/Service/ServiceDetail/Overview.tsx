import { convertByteToMB, convertMBtoGB, timeCalculator } from '@/helpers'
import { Button, Popconfirm, Popover, Switch } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { getVMDetail, startCloud, stopCloud } from '@/services/apiv2'
import { Icon } from '@iconify/react'

type Props = {
    service: any
    vm: any
    handleRefreshVm: (vm: any) => void
}

function Overview({ service, vm, handleRefreshVm }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isStarting, setIsStarting] = useState<boolean>(false)
    const [isStopping, setIsStopping] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isShowConfirmStart, setIsShowConfirmStart] = useState<boolean>(false)
    const [isShowConfirmReboot, setIsShowConfirmReboot] =
        useState<boolean>(false)
    const [isShowConfirmShutdown, setIsShowConfirmShutdown] =
        useState<boolean>(false)

    const genIP = () => {
        return Object.values(vm?.ip)?.[0] as any
    }

    const genStatus = (value: string) => {
        if (value === 'running') return true
        return false
    }

    const handleStartVM = async () => {
        try {
            setIsStarting(true)
            console.log(service)
            const result = await startCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleStopVM = async () => {
        try {
            setIsShowConfirmStart(false)
            setIsStopping(true)
            console.log(service)
            const result = await stopCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRefreshVM = async () => {
        try {
            setIsRefreshing(true)
            const result = await getVMDetail(vm?.id, service?.id)

            const { data } = result?.data
            handleRefreshVm(data || vm)
        } catch (error) {
            console.log(error)
        } finally {
            setIsRefreshing(false)
            setIsStarting(false)
            setIsStopping(false)
        }
    }

    return (
        <div className="overview">
            <div className="d-flex align-items-center justify-content-between">
                <h5>Server Details</h5>
                {isStarting || isStopping ? (
                    <div>
                        <Icon
                            style={{
                                width: '24px',
                                height: '24px',
                                marginRight: '4px',
                            }}
                            icon={'line-md:loading-twotone-loop'}
                        />
                        <strong>Server is performing task</strong>
                    </div>
                ) : genStatus(vm?.status) ? (
                    <div>
                        <Button type="default">Console</Button>
                        <Popconfirm
                            open={isShowConfirmReboot}
                            placement="bottomLeft"
                            title={'Bạn có muốn reboot VM không?'}
                            // onConfirm={handleStopVM}
                            okText="Yes"
                            cancelText="No"
                            onCancel={() => setIsShowConfirmStart(false)}
                        >
                            <Button type="default">Reboot</Button>
                        </Popconfirm>
                        <Button type="default">Shutdown</Button>
                        <Button type="default">More</Button>
                    </div>
                ) : (
                    <div>sterp</div>
                )}
            </div>
            <div className="content">
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Trạng thái</div>
                            <div className="d-flex align-items-center">
                                {isStarting ? (
                                    <div>Starting</div>
                                ) : isStopping ? (
                                    <div>Stopping</div>
                                ) : (
                                    <Popconfirm
                                        open={isShowConfirmStart}
                                        placement="bottomLeft"
                                        title={'Bạn có muốn stop VM không?'}
                                        onConfirm={handleStopVM}
                                        okText="Yes"
                                        cancelText="No"
                                        onCancel={() =>
                                            setIsShowConfirmStart(false)
                                        }
                                    >
                                        <Switch
                                            checkedChildren="Bật"
                                            unCheckedChildren="Tắt"
                                            checked={genStatus(vm?.status)}
                                            onChange={() => {
                                                if (genStatus(vm?.status)) {
                                                    setIsShowConfirmStart(true)
                                                } else {
                                                    handleStartVM()
                                                }
                                            }}
                                        />
                                    </Popconfirm>
                                )}

                                <a onClick={handleRefreshVM} className="mx-2">
                                    Làm mới lại{' '}
                                </a>
                            </div>
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
                            <div>{convertMBtoGB(vm?.memory || 0)} GB</div>
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
