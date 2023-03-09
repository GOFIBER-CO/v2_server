import { convertByteToMB, convertMBtoGB, timeCalculator } from '@/helpers'
import {
    Button,
    Dropdown,
    Form,
    Input,
    MenuProps,
    Modal,
    Popconfirm,
    Popover,
    Switch,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
    getVMDetail,
    rebootCloud,
    resetCloud,
    shutDownCloud,
    startCloud,
    stopCloud,
} from '@/services/apiv2'
import { Icon } from '@iconify/react'
import { notify, notifyType } from '@/App'

type Props = {
    service: any
    vm: any
    handleRefreshVm: (vm: any) => void
}

function Overview({ service, vm, handleRefreshVm }: Props) {
    const [form] = Form.useForm()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isStarting, setIsStarting] = useState<boolean>(false)
    const [isStopping, setIsStopping] = useState<boolean>(false)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isShowConfirmStart, setIsShowConfirmStart] = useState<boolean>(false)
    const [isRebooting, setIsRebooting] = useState<boolean>(false)
    const [isShutdown, setIsShutdown] = useState<boolean>(false)
    const [isResetting, setIsResetting] = useState<boolean>(false)
    const [isShowControlPanel, setIsControlPanel] = useState<boolean>(false)

    useEffect(() => {
        if (vm?.status === 'rebooting') {
            setIsRebooting(true)
        } else {
            setIsRebooting(false)
            setIsStarting(false)
            setIsStopping(false)
            setIsShutdown(false)
            setIsResetting(false)
        }
    }, [vm])

    const items: MenuProps['items'] = [
        {
            label: <a>Reset</a>,
            key: '0',
            onClick: () => handleResetVM(),
        },
        {
            type: 'divider',
        },
        // {
        //     label: <a>Cài đặt lại</a>,
        //     key: '1',
        // },
        // {
        //     type: 'divider',
        // },
        // {
        //     label: <a>Upgrade</a>,
        //     key: '5',
        // },
        // {
        //     type: 'divider',
        // },
        {
            label: <a>Panel Login</a>,
            key: '2',
            onClick: () => {
                setIsControlPanel(true)
            },
        },
        {
            type: 'divider',
        },
        {
            label: <a>Boot Order</a>,
            key: '3',
        },
        {
            type: 'divider',
        },
        {
            label: <a>ISO Image</a>,
            key: '4',
        },
    ]
    const genIP = () => {
        return vm?.ip && Object.values(vm?.ip)?.[0] as any
    }

    const genStatus = (value: string) => {
        if (value === 'running') return true
        return false
    }

    const handleStartVM = async () => {
        try {
            setIsStarting(true)
            notify(notifyType.NOTIFY_SUCCESS, 'VM đang được start')

            const result = await startCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleStopVM = async () => {
        try {
            setIsShowConfirmStart(false)
            setIsStopping(true)
            notify(notifyType.NOTIFY_SUCCESS, 'VM đang được stop')

            const result = await stopCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRebootVM = async () => {
        try {
            setIsRebooting(true)
            notify(notifyType.NOTIFY_SUCCESS, 'VM đang được reboot')

            const result = await rebootCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleShutdownVM = async () => {
        try {
            setIsShutdown(true)
            notify(notifyType.NOTIFY_SUCCESS, 'VM đang được shutdown')

            const result = await shutDownCloud(vm?.id, service?.id)
        } catch (error) {
            console.log(error)
        }
    }

    const handleResetVM = async () => {
        try {
            setIsResetting(true)
            notify(notifyType.NOTIFY_SUCCESS, 'VM đang được reset')

            const result = await resetCloud(vm?.id, service?.id)
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
            setIsRebooting(false)
            setIsResetting(false)
            setIsShutdown(false)
        }
    }


    return (
        <div className="overview">
            <div className="d-flex align-items-center justify-content-between">
                <h5>Server Details</h5>
                {isStarting ||
                isStopping ||
                isRebooting ||
                isShutdown ||
                isResetting ? (
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
                            placement="bottom"
                            title={'Bạn có muốn reboot VM không?'}
                            onConfirm={handleRebootVM}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="default">Reboot</Button>
                        </Popconfirm>
                        <Popconfirm
                            placement="bottom"
                            title={'Bạn có muốn shutdown VM không?'}
                            onConfirm={handleShutdownVM}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="default">Shutdown</Button>
                        </Popconfirm>
                        <Dropdown
                            placement="bottomRight"
                            menu={{ items }}
                            trigger={['click']}
                        >
                            <Button type="default">More</Button>
                        </Dropdown>
                    </div>
                ) : (
                    <div>
                        <Button onClick={handleStartVM} type="default">
                            Startup
                        </Button>
                        <Button
                            onClick={() => {
                                setIsControlPanel(true)
                            }}
                            type="default"
                        >
                            Panel Login
                        </Button>
                    </div>
                )}
            </div>
            <div className="content">
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Trạng thái</div>
                            <div className="d-flex align-items-center">
                                {isStarting ? (
                                    <div className="running">STARTING</div>
                                ) : isStopping ? (
                                    <div className="running">STOPPING</div>
                                ) : isRebooting ? (
                                    <div className="running">REBOOTING</div>
                                ) : isShutdown ? (
                                    <div className="running">SHUTDOWN</div>
                                ) : isResetting ? (
                                    <div className="running">RESETTING</div>
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
                            <div>{service?.domain || "Linda"}</div>
                        </div>
                    </div>
                </div>
                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Tên đăng nhập</div>
                            <div>{service?.username ? service?.username : (service?.os == 'Centos 7' ? 'root' : 'administrator')}</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Mật khẩu</div>
                            {showPassword ? (
                                <div>{vm?.password || service?.pass}</div>
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
                                                Mạng: {genIP()?.network ? genIP()?.network : service?.ip}
                                            </div>
                                            <div className="mt-2">
                                                Gateway:  {genIP()?.network ? genIP()?.network : service?.ip}
                                            </div>
                                        </div>
                                    }
                                >
                                    <div
                                        style={{
                                            borderBottom: '1px dashed #000',
                                        }}
                                    >
                                        {genIP()?.network ? genIP()?.ip : service?.ip}
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
                            <div>{vm?.template_name || service?.os}</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>Bandwidth</div>
                            <div>
                                <span>
                                    IN:{' '}
                                    {vm?.bandwidth?.data_received ? convertByteToMB(
                                        vm?.bandwidth?.data_received || 0
                                    ) : "Unlimited"}
                                </span>
                                <span style={{ marginLeft: '12px' }}>
                                    OUT:{' '}
                                    {vm?.bandwidth?.data_received ? convertByteToMB(
                                        vm?.bandwidth?.data_send || 0
                                    ) : "Unlimited"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="view-item bbottom">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>Dung lượng lưu trữ</div>
                            <div>{vm?.disk || service?.ssd} GB</div>
                        </div>
                        <div className="col col-12 col-md-6">
                            <div>RAM</div>
                            <div>{vm?.memory ?  convertMBtoGB(vm?.memory || 0) : service?.ram} GB</div>
                        </div>
                    </div>
                </div>

                <div className="view-item">
                    <div className="row">
                        <div className="col col-12 col-md-6">
                            <div>CPU(s)</div>
                            <div>{vm?.cpus || service?.cpu} Cores</div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Panel Login"
                open={isShowControlPanel}
                onCancel={() => setIsControlPanel(false)}
                footer={null}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên đăng nhập" name="username">
                        <Input
                            readOnly
                            placeholder="Tên đăng nhập"
                            defaultValue={service?.username}
                        />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password">
                        <Input
                            readOnly
                            placeholder="input placeholder"
                            defaultValue={service?.password}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Overview
