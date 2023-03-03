import { useLayoutInit } from '@/hooks/useInitLayOut'
import {
    createCloud,
    createService,
    getArea,
    getOperatingSystemChildren,
    getPrice,
    getProductsBySubOrderPage,
    getServer,
} from '@/services/apis'
import '@/styles/pages/CloudVps/CreateCloud/CreateCloud.scss'
import { useEffect, useState, useMemo, useCallback } from 'react'
import IArea from '@/interfaces/IArea'
import IService from '@/interfaces/IService'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import IPackageServer from '@/interfaces/IPackageServer'
import IProfileCloudServer from '@/interfaces/IProfileCloudServer'
import ConverMoney from '@/components/Conver/ConverMoney'
import IInserCloudServer from '@/interfaces/IInserCloudServer'
import { notify, notifyType } from '@/App'
import OperatingSystem from '@/components/OperatingSystem/OperatingSystem'
import Server from '@/components/Server/Server'
import Area from '@/components/Area/Area'
import PackageServer from '@/components/PackageServer/PackageServer'
import { Button, Radio, Slider } from 'antd'
import { useNavigate } from 'react-router'
import IPrice from '@/interfaces/IPrice'
import { CYCLE_TIME, RESPONSE_STATUS } from '@/helpers'
import PaymentMethod from '@/components/CloudVPS/PaymentMethod'
import ICreateNewService from '@/interfaces/ICreateNewService'
import { createNewService, getProductDetailForConfig } from '@/services/apiv2'
import { AiFillInfoCircle } from 'react-icons/ai'

const dataForConfig = [
    {
        id: 39,
        type: 'slider',
        required: '0',
        name: 'RAM [GB]',
        key: 'cf_memory',
        variable: 'memory',
        description: '',
        category: 'server',
        product_id: '17',
        copy_of: '39',
        options: '50',
        config: {
            conditionals: [],
            minvalue: '1',
            maxvalue: '32',
            step: '1',
            initialval: '1',
            upgradefee: '0.00',
            downgradefee: '0.00',
        },
        sort_order: '1',
        group_id: '0',
        items: [
            {
                id: 146,
                category_id: '39',
                variable_id: '',
                sort_order: '1',
                copy_of: '146',
                pricing: true,
                paytype: 'Regular',
                m: '1000.00',
            },
        ],
        premade: true,
    },
    {
        id: 40,
        type: 'slider',
        required: '0',
        name: 'CPU Cores',
        key: 'cf_cpu',
        variable: 'cpu_cores',
        description: '',
        category: 'server',
        product_id: '17',
        copy_of: '40',
        options: '50',
        config: {
            conditionals: [],
            minvalue: '1',
            maxvalue: '24',
            step: '1',
            initialval: '1',
            upgradefee: '0.00',
            downgradefee: '0.00',
        },
        sort_order: '2',
        group_id: '0',
        items: [
            {
                id: 147,
                category_id: '40',
                variable_id: '',
                sort_order: '1',
                copy_of: '147',
                pricing: true,
                paytype: 'Regular',
                m: '100000.00',
            },
        ],
        premade: true,
    },
    {
        id: 41,
        type: 'select',
        required: '0',
        name: 'OS Template',
        key: '',
        variable: 'os',
        description: '',
        category: 'software',
        product_id: '17',
        copy_of: '41',
        options: '2',
        config: {
            conditionals: [],
            upgradefee: '0.00',
            downgradefee: '0.00',
        },
        sort_order: '3',
        group_id: '0',
        items: [
            {
                id: 149,
                category_id: '41',
                name: '256 ubuntu20.tino.org',
                variable_id: 'template:256/base-256-disk-0.raw',
                sort_order: '2',
                copy_of: '149',
                m: '0',
            },
            {
                id: 150,
                category_id: '41',
                name: '302 win2019',
                variable_id: 'template:302/base-302-disk-0.raw',
                sort_order: '3',
                copy_of: '150',
                m: '0',
            },
            {
                id: 152,
                category_id: '41',
                name: '306 debian11.tino.org',
                variable_id: 'template:306/base-306-disk-0.raw',
                sort_order: '5',
                copy_of: '152',
                m: '0',
            },
            {
                id: 153,
                category_id: '41',
                name: '308 centos7',
                variable_id: 'template:308/base-308-disk-0.raw',
                sort_order: '6',
                copy_of: '153',
                m: '0',
            },
            {
                id: 154,
                category_id: '41',
                name: '309 almalinux8',
                variable_id: 'template:309/base-309-disk-0.raw',
                sort_order: '7',
                copy_of: '154',
                m: '0',
            },
        ],
        premade: true,
    },
    {
        id: 42,
        type: 'slider',
        required: '0',
        name: 'Disk Size [GB]',
        key: 'cf_hdd',
        variable: 'disk_size',
        description: '',
        category: 'server',
        product_id: '17',
        copy_of: '42',
        options: '50',
        config: {
            conditionals: [],
            minvalue: '20',
            maxvalue: '500',
            step: '5',
            initialval: '20',
            upgradefee: '0.00',
            downgradefee: '0.00',
        },
        sort_order: '4',
        group_id: '0',
        items: [
            {
                id: 158,
                category_id: '42',
                variable_id: '',
                sort_order: '1',
                copy_of: '158',
                pricing: true,
                paytype: 'Regular',
                m: '1000.00',
            },
        ],
        premade: true,
    },
]

const osTemplate = [
    {
        id: 1,
        name: 'Windows',
        image: (
            <img
                src={'/public/images/icon-windows.svg'}
                alt=""
                width={48}
                height={48}
            />
        ),
        template: [
            {
                id: '36',
                idCustom: '302 win2019',
                name: 'Windows Server 2019',
                subOrderPage: 1,
            },
        ],
    },
    {
        id: 2,
        name: 'Linux',
        image: (
            <img
                src={'/public/images/icon-ubuntu.svg'}
                alt=""
                width={48}
                height={48}
            />
        ),
        template: [
            {
                id: '118',
                idCustom: '256 ubuntu20.tino.org',
                name: 'Ubuntu20',
                subOrderPage: 2,
            },
            {
                id: '122',
                idCustom: '308 centos7',
                name: 'Centos7',
                subOrderPage: 2,
            },
            {
                id: '121',
                idCustom: '306 debian11.tino.org',
                name: 'Debian11',
                subOrderPage: 2,
            },
            {
                id: '123',
                idCustom: '309 almalinux8',
                name: 'Almalinux8',
                subOrderPage: 2,
            },
        ],
    },
]

const cycleTime = [
    {
        id: CYCLE_TIME.MONTHLY,
        name: 'Giá Theo Tháng',
        extra: 'Tháng',
    },
    {
        id: CYCLE_TIME.QUARTERLY,
        name: 'Giá Theo 3 Tháng',
        extra: '3 Tháng',
    },
    {
        id: CYCLE_TIME.SEMI_ANNUALLY,
        name: 'Giá Theo 6 Tháng',
        extra: '6 Tháng',
    },
    {
        id: CYCLE_TIME.ANNUALLY,
        name: 'Giá Theo Năm',
        extra: 'Năm',
    },
]

const paymentMethods = [
    {
        object_id: 13,
        name: 'ACB - Ngân hàng TMCP Á Châu',
        image: 'https://cdn.tgdd.vn/2020/04/GameApp/unnamed-200x200-18.png',
    },
    {
        object_id: 14,
        name: 'Cổng thanh toán VNPAY',
        image: 'https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vnpayqr-2021-mien-phi.jpg',
    },
    {
        object_id: 15,
        name: 'Ví điện tử MoMo',
        image: 'https://cdn.tgdd.vn/2020/03/GameApp/Untitled-2-200x200.jpg',
    },
]

const CreateCloud: React.FC = () => {
    const layout = useLayoutInit()

    const iArea: IArea[] = []
    const [dataArea, setDataArea] = useState(iArea)
    const [numberCloud, setNumberCloud] = useState(1)
    const [isCustomServer, setIsCustomServer] = useState(false)
    const [unit, setUnit] = useState(cycleTime[0])
    const [CPU, setCPU] = useState(1)
    const [RAM, setRAM] = useState(1)
    const [DISK, setDISK] = useState(1)

    const [chosenOsTemplate, setChosenOsTemplate] = useState<any>(
        osTemplate[0].template[0]
    )
    const [products, setProducts] = useState([])
    const [chosenProduct, setChosenProduct] = useState<any>({})
    const [toggle, setToggle] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState<any>(paymentMethods[0])

    const [config, setConfig] = useState<{
        ram?: any
        cpu?: any
        disk?: any
        cycle?: any
        os?: any[]
    }>({
        ram: {},
        cpu: {},
        disk: {},
        cycle: {
            id: 'cycle',
        },
        os: [],
    })

    // For check setup fee
    const [items, setItems] = useState<
        Array<{
            formatted: string
            price: number
            setup: number
            value: string
        }>
    >([])

    const navigate = useNavigate()

    const [newCloudServer, setNewCloudServer] = useState<IInserCloudServer>({
        cloudServerName: '',
        password: '',
        port: '',
        user: '',
        area: '',
        operatingSystem: '',
        server: '',
        autoBackup: false,
    })

    const onclickArea = (item: IArea) => {
        if (item.status == 0) {
            dataArea.map((val) => {
                ;(val.isCheck = val._id == item._id ? true : false),
                    iArea.push(val)
            })
            newCloudServer.area = item._id || ''
            setDataArea(iArea)
        }
    }

    const onchanngeOperatingSystemItem = async (event: any) => {
        setChosenOsTemplate(event)
    }

    useEffect(() => {
        const getProductByOs = async (id: string) => {
            try {
                const result = await getProductsBySubOrderPage(id)

                const { data } = result?.data
                setProducts(data || [])

                if (data?.length > 0) {
                    getProductForConfig(data?.[0]?.object_id, data?.[0])
                    // setChosenProduct( || {})
                }
            } catch (error) {
                console.log('getProductsBySubOrderPage', error)
            }
        }

        if (chosenOsTemplate?.subOrderPage)
            getProductByOs(chosenOsTemplate?.subOrderPage)
    }, [chosenOsTemplate])

    const onclickServer = (item: any) => {
        getProductForConfig(item?.object_id, item)
        // setChosenProduct(item)
    }

    const cPrice = useMemo(() => {
        let total = 0
        let fee = 0

        if (isCustomServer) {
            Object.entries(config).forEach((item) => {
                const [attr, value] = item
                if (attr === 'cycle') {
                    total += value?.price
                } else if (attr === 'ram') {
                    total += RAM === value?.minValue ? 0 : value?.price * RAM
                } else if (attr === 'cpu') {
                    total += CPU === value?.minValue ? 0 : value?.price * CPU
                } else if (attr === 'disk') {
                    total += DISK === value?.minValue ? 0 : value?.price * DISK
                }
            })

            return total === config?.cycle?.price ? 0 : total
        }

        fee = items?.find((item) => item?.value === unit?.id)?.setup || 0
        return chosenProduct[unit.id] + fee
    }, [unit, chosenProduct, isCustomServer, CPU, RAM, DISK])

    const onclickPackageServer = (item: any) => {
        setUnit(item)
    }

    const onChangeConfig = (value: any, variable: 'cpu' | 'ram' | 'disk') => {
        switch (variable) {
            case 'cpu':
                setCPU(value)
                break

            case 'ram':
                setRAM(value)
                break

            case 'disk':
                setDISK(value)
                break
        }
    }

    const getProductForConfig = async (id?: string, e?: any) => {
        try {
            const result = await getProductDetailForConfig((id ||= '17'))
            const { data } = result?.data

            const { form, product } = data?.config

            const cycle = product.find((item: any) => item?.id === 'cycle')
            const ram = dataForConfig.find(
                (item) => item?.variable === 'memory'
            )

            const cpu = dataForConfig.find(
                (item) => item?.variable === 'cpu_cores'
            )

            const disk = dataForConfig.find(
                (item) => item?.variable === 'disk_size'
            )

            const os = dataForConfig.find((item) => item?.variable === 'os')

            setRAM(Number(ram?.config?.minvalue))
            setCPU(Number(cpu?.config?.minvalue))
            setDISK(Number(disk?.config?.minvalue))

            setConfig({
                cycle: {
                    id: 'cycle',
                    ...cycle?.items[0],
                },
                ram: {
                    name: `custom[${ram?.id}][${ram?.items[0].id}]`,
                    price: Number(ram?.items[0]?.m || 0),
                    minValue: Number(ram?.config?.minvalue),
                    maxValue: Number(ram?.config?.maxvalue),
                    step: Number(ram?.config?.step),
                },
                cpu: {
                    name: `custom[${cpu?.id}][${cpu?.items[0].id}]`,
                    price: Number(cpu?.items[0]?.m || 0),
                    minValue: Number(cpu?.config?.minvalue),
                    maxValue: Number(cpu?.config?.maxvalue),
                    step: Number(cpu?.config?.step),
                },
                disk: {
                    name: `custom[${disk?.id}][${disk?.items[0].id}]`,
                    price: Number(disk?.items[0]?.m || 0),
                    minValue: Number(disk?.config?.minvalue),
                    maxValue: Number(disk?.config?.maxvalue),
                    step: Number(disk?.config?.step),
                },
                os: os?.items,
            })
            console.log('items', cycle?.items)
            setItems(cycle?.items)
            e && setChosenProduct(e)
        } catch (error) {
            console.log('ProductForConfig', error)
        }
    }

    useEffect(() => {
        if (isCustomServer) {
            getProductForConfig()
        }
    }, [isCustomServer])

    const onFinish = async () => {
        try {
            layout.setLoading(true)
            let data: ICreateNewService = {
                cycle: unit.id,
                domain: 'test.com',
                pay_method: paymentMethod?.object_id,
                product_id: chosenProduct?.object_id,
                os: chosenOsTemplate?.name,
                type: 'instance',
            }

            if (isCustomServer) {
                const dataCustom: string[] = []

                Object.entries(config).forEach((item) => {
                    const [attr, value] = item
                    if (attr === 'ram') {
                        dataCustom.push(`${value?.name}: ${RAM}`)
                    } else if (attr === 'cpu') {
                        dataCustom.push(`${value?.name}: ${CPU}`)
                    } else if (attr === 'disk') {
                        dataCustom.push(`${value?.name}: ${DISK}`)
                    }
                })

                data = {
                    ...data,
                    product_id: '17',
                    os: chosenOsTemplate?.idCustom,
                    cycle: cPrice === 0 ? 'Free' : 'm',
                    type: 'custom',
                    dataCustom,
                }
            }

            console.log(data)
            return
            const result = await createNewService(data)

            const { status, data: resData } = result?.data

            if (status === RESPONSE_STATUS.SUCCESS) {
                console.log('resData', resData)
            }

            notify(notifyType.NOTIFY_SUCCESS, 'Đang tạo dịch vụ vui lòng đợi')
            navigate('/cloud-vps')
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    const renderChooseOsTemplate = {
        chosen: (
            <>
                <div className="package-server">
                    <div className="tabs-container">
                        <ul className="list-package-server">
                            {cycleTime.map((item) => (
                                <PackageServer
                                    key={item?.id}
                                    isCheck={unit?.id === item?.id}
                                    data={item}
                                    onchange={(data) => {
                                        onclickPackageServer(data)
                                    }}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="deploy_options">
                    <div className="row">
                        {products?.map((item: any) => (
                            <Server
                                isCheck={
                                    item.object_id === chosenProduct?.object_id
                                }
                                data={item}
                                unit={unit?.id}
                                onchange={(data) => {
                                    onclickServer(data)
                                }}
                            />
                        ))}
                    </div>
                </div>
            </>
        ),
        notChoose: (
            <div className="my-4 text-center">
                <h5>Vui lòng chọn Hệ điều hành</h5>
            </div>
        ),
    }

    return (
        <>
            <div className="create-cloud">
                <div className="create-cloud-location">
                    <p className="create-cloud-location-title">Chọn khu vực</p>
                    <div className="list-area">
                        <>
                            {dataArea?.map((item) => (
                                <Area
                                    data={item}
                                    onchange={(data) => {
                                        onclickArea(data)
                                    }}
                                />
                            ))}
                        </>
                    </div>
                </div>
                <div className="create-cloud-os">
                    <p className="create-cloud-location-title">
                        CHỌN HỆ ĐIỀU HÀNH
                    </p>
                    <div className="servertype_section">
                        <>
                            {osTemplate?.map((item) => (
                                <OperatingSystem
                                    data={item}
                                    isShow={Boolean(item.id === toggle)}
                                    isCheck={Boolean(
                                        item?.template.find(
                                            (e) => e.id === chosenOsTemplate?.id
                                        )
                                    )}
                                    onchangeItem={(data) => {
                                        onchanngeOperatingSystemItem(data)
                                    }}
                                    setIsShow={setToggle}
                                    chosenOsTemplate={chosenOsTemplate}
                                />
                            ))}
                        </>
                    </div>
                </div>

                {isCustomServer ? (
                    <div className="create-cloud-config">
                        <div className="server">
                            <span className="create-cloud-location-title">
                                TUỲ CHỈNH CẤU HÌNH
                            </span>
                            <div className="deploy_title">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        setIsCustomServer(!isCustomServer)
                                    }
                                >
                                    Tuỳ chỉnh cấu hình{' '}
                                </button>
                            </div>
                        </div>
                        <div className="deploy_options">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-7">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <div className="d-flex align-items-center justify-content-between">
                                                CPU (vCPUs):
                                                <label>
                                                    <strong>{CPU}</strong>
                                                </label>
                                            </div>
                                            <Slider
                                                onChange={(e) =>
                                                    onChangeConfig(e, 'cpu')
                                                }
                                                defaultValue={
                                                    config?.cpu?.minValue
                                                }
                                                min={config?.cpu?.minValue}
                                                max={config?.cpu?.maxValue}
                                                step={config?.cpu?.step}
                                                value={CPU}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <label>RAM (GB):</label>
                                                <label>
                                                    <strong>{RAM}</strong>
                                                </label>
                                            </div>

                                            <Slider
                                                onChange={(e) =>
                                                    onChangeConfig(e, 'ram')
                                                }
                                                defaultValue={
                                                    config?.ram?.minValue
                                                }
                                                min={config?.ram?.minValue}
                                                max={config?.ram?.maxValue}
                                                step={config?.ram?.step}
                                                value={RAM}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="d-flex align-items-center justify-content-between">
                                                DISK SIZE(GB): {'   '}
                                                <label>
                                                    <strong>{DISK}</strong>
                                                </label>
                                            </div>
                                            <Slider
                                                onChange={(e) =>
                                                    onChangeConfig(e, 'disk')
                                                }
                                                defaultValue={
                                                    config?.cpu?.minValue
                                                }
                                                min={config?.disk?.minValue}
                                                max={config?.disk?.maxValue}
                                                step={config?.disk?.step}
                                                value={DISK}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Hoá đơn tính theo:</label>
                                            <div>
                                                <Radio checked>
                                                    Giá Theo Tháng
                                                </Radio>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-md-5">
                                    <div className="price_box">
                                        <div className="price_header">
                                            <span>Tùy Chỉnh Cấu Hình</span>
                                        </div>
                                        <div className="price_number">
                                            <div className="py-2">
                                                <h4>
                                                    {ConverMoney(cPrice) || 0} ₫
                                                </h4>
                                            </div>
                                            <p className="money">
                                                <span> VND</span>/{unit?.extra}
                                            </p>
                                        </div>
                                        <div className="price_body">
                                            <ul>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        CPU:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {CPU} vCPU
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        RAM:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {RAM} GB
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        SSD:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {DISK} GB
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        Banwitdh:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        Unlimited
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        IPv4:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        1 Địa chỉ
                                                    </strong>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="create-cloud-config">
                        <div className="server">
                            <span className="create-cloud-location-title">
                                CẤU HÌNH CÓ SẴN
                            </span>
                            <div
                                className="deploy_title"
                                style={{ display: 'flex' }}
                            >
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        setIsCustomServer(!isCustomServer)
                                    }
                                >
                                    Tuỳ chỉnh cấu hình
                                </button>
                            </div>
                        </div>
                        {chosenOsTemplate
                            ? renderChooseOsTemplate['chosen']
                            : renderChooseOsTemplate['notChoose']}
                    </div>
                )}
                <div className="create-cloud-os">
                    <p className="create-cloud-location-title">
                        CHỌN PHƯƠNG THỨC THANH TOÁN
                    </p>
                    <div className="my-4 servertype_section">
                        {paymentMethods?.map((item) => (
                            <PaymentMethod
                                data={item}
                                isCheck={
                                    paymentMethod?.object_id === item?.object_id
                                }
                                onchangeItem={(data) => {
                                    setPaymentMethod(data)
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="create-cloud-caculate-price">
                    <div className="sidebar-info">
                        {chosenProduct?.object_id ? (
                            <>
                                <div className="deploy-summary-price">
                                    <div className="d-flex align-items-center">
                                        <span className="cost"> Chi phí: </span>
                                        <button
                                            style={{
                                                padding: '0px',
                                                border: 'none',
                                                background: 'transparent',
                                            }}
                                            className="mx-2"
                                        >
                                            <AiFillInfoCircle
                                                style={{
                                                    width: '22px',
                                                    height: '22px',
                                                    color: '#007bfc',
                                                }}
                                            />
                                        </button>
                                    </div>
                                    <div>
                                        <span className="order_total">
                                            {ConverMoney(
                                                cPrice * numberCloud || 0
                                            ) || 0}
                                            đ
                                        </span>
                                        <span className="deploy-summary-price-label">
                                            /
                                            {isCustomServer
                                                ? 'Tháng'
                                                : unit?.extra}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div></div>
                        )}

                        <input
                            onClick={() => onFinish()}
                            type="button"
                            className="responsive-full-width"
                            value="Khởi tạo ngay"
                        ></input>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateCloud
