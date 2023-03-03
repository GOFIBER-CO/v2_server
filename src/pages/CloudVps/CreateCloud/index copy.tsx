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
import { Radio, Slider } from 'antd'
import { useNavigate } from 'react-router'
import IPrice from '@/interfaces/IPrice'
import { CYCLE_TIME, RESPONSE_STATUS } from '@/helpers'
import PaymentMethod from '@/components/CloudVPS/PaymentMethod'
import ICreateNewService from '@/interfaces/ICreateNewService'
import { createNewService, getProductDetailForConfig } from '@/services/apiv2'
// import console from 'console'

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
    const iOparatingSystemArray: IOparatingSystemArray[] = []
    // const [dataOperatingSystem, setDataOperatingSystem] = useState(
    //     iOparatingSystemArray
    // )
    const iService: IService[] = []
    const [dataServer, setDataServer] = useState(iService)
    const iPackageServer: IPackageServer[] = []
    const [dataPackageServer, setDataPackageServer] = useState(iPackageServer)

    const [numberCloud, setNumberCloud] = useState(1)
    const [isCustomServer, setIsCustomServer] = useState(true)

    const iProfileCloudServer: IProfileCloudServer[] = []
    const [dataProfileCloudServer, setDataProfileCloudServer] =
        useState(iProfileCloudServer)

    const [price, setPrice] = useState(0)
    const [unit, setUnit] = useState(cycleTime[0])

    const [priceServer, setPriceServer] = useState(130000)
    const [CPU, setCPU] = useState(1)
    const [RAM, setRAM] = useState(1)
    const [DISK, setDISK] = useState(1)
    const [bandwidth, setBandwidth] = useState(10)
    const [tranfer, setTranfer] = useState('Unlimited')
    const [IPv4, setIPv4] = useState(1)
    const [priceMonth, setPriceMonth] = useState(true)
    const [HDD, setHDD] = useState(0)
    const [autoBackup, setAutoBackup] = useState(false)
    const [priceVps, setPriceVps] = useState<IPrice>({
        ram: 1,
        ssd: 1,
        cpu: 1,
    })
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

    const getVpsPrice = async () => {
        try {
            layout.setLoading(true)
            const result = await getPrice()
            setPriceVps(result.data.price)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    let iInserCloudServer: IInserCloudServer[] = []

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

    const [newService, setNewService] = useState<IService>({
        serverName: '',
        ssd: '',
        bandwidth: '',
        price: 0,
        cpu: '',
        ram: '',
        tranfer: '',
        serverDefault: true,
        ipv4: '',
        discount: 0,
        expiryDateType: 1,
        hdd: '',
    })

    iProfileCloudServer.push({
        _id: 1,
        cloudServerName: '',
        password: '',
        port: '',
    })

    iPackageServer.push(
        {
            _id: 1,
            status: 1,
            name: 'Giá Theo Giờ',
            isCheck: false,
        },
        {
            _id: 2,
            status: 2,
            name: 'Giá Theo Ngày',
            isCheck: false,
        },
        {
            _id: 3,
            status: 3,
            name: 'Giá Theo Tháng',
            isCheck: true,
        },
        {
            _id: 4,
            status: 4,
            name: 'Giá Theo 3 Tháng',
            isCheck: false,
        },
        {
            _id: 5,
            status: 5,
            name: 'Giá Theo 6 Tháng',
            isCheck: false,
        },
        {
            _id: 6,
            status: 6,
            name: 'Giá Theo Năm',
            isCheck: false,
        }
    )

    // const intData = () => {
    //     laodArea()
    //     laodOperatingSystem()
    //     laodServer(3)
    //     setDataPackageServer(iPackageServer)
    //     setDataProfileCloudServer(iProfileCloudServer)
    // }

    // const loadUnit = (expiryDateType: number) => {
    //     switch (expiryDateType) {
    //         case 1:
    //             setUnit('Giờ')
    //             break
    //         case 2:
    //             setUnit('Ngày')
    //             break
    //         case 3:
    //             setUnit('Tháng')
    //             break
    //         case 4:
    //             setUnit('Tháng')
    //             break
    //         case 5:
    //             setUnit('Tháng')
    //             break
    //         case 6:
    //             setUnit('Năm')
    //             break
    //         default:
    //             break
    //     }
    // }

    // const laodArea = async () => {
    //     try {
    //         layout.setLoading(true)
    //         const area = await getArea()
    //         if (!area.data) return
    //         //set Area defaultl id = 6357fa668e588482157019cd
    //         let dataArea = area.data.data.map((obj: any) =>
    //             obj._id === area.data?.data[0]?._id
    //                 ? { ...obj, isCheck: true }
    //                 : { ...obj, isCheck: false }
    //         )
    //         newCloudServer.area = area.data.data.find(
    //             (item: any) => item._id === area.data?.data[0]?._id
    //         )?._id
    //         setDataArea(dataArea)
    //         layout.setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     }
    // }

    // const laodOperatingSystem = async () => {
    //     try {
    //         layout.setLoading(true)
    //         const operatingSystem = await getOperatingSystemChildren()
    //         if (!operatingSystem.data) return
    //         setDataOperatingSystem(operatingSystem.data.data)
    //         layout.setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     }
    // }

    // const laodServer = async (expiryDateType: number) => {
    //     if (!expiryDateType) {
    //         expiryDateType = 3
    //     }
    //     try {
    //         layout.setLoading(true)
    //         const server = await getServer(expiryDateType)
    //         if (!server.data) return
    //         //set server default
    //         let dataPackageServers = dataPackageServer.map((obj: any) =>
    //             obj._id === dataPackageServer[2]._id
    //                 ? { ...obj, isCheck: true }
    //                 : { ...obj, isCheck: false }
    //         )
    //         setDataPackageServer(dataPackageServers)
    //         setPrice(server.data.data[0].price)
    //         newCloudServer.server = server.data.data[0]._id || ''
    //         let dataServer = server.data.data.map((obj: any) =>
    //             obj._id === server.data.data[0]._id
    //                 ? { ...obj, isCheck: true }
    //                 : { ...obj, isCheck: false }
    //         )
    //         setDataServer(dataServer)

    //         layout.setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     }
    // }

    // const onchangeLaodServer = async (expiryDateType: number) => {
    //     try {
    //         layout.setLoading(true)
    //         const server = await getServer(expiryDateType)
    //         if (!server.data) return
    //         //set server default
    //         let dataServer = server.data.data.map((obj: any) =>
    //             obj._id === server.data.data[0]._id
    //                 ? { ...obj, isCheck: true }
    //                 : { ...obj, isCheck: false }
    //         )
    //         setDataServer(dataServer)

    //         layout.setLoading(false)
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     }
    // }

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

    // const toggleShowing = (id: string) => {
    //     const newOperatingSystemArray = dataOperatingSystem.map((val) => {
    //         if (id == val._id) {
    //             if (val.isShow) val.isShow = false
    //             else val.isShow = true
    //         } else {
    //             val.isShow = false
    //         }
    //         return val
    //     })
    //     setDataOperatingSystem(newOperatingSystemArray)
    // }

    const onchanngeOperatingSystemItem = async (event: any) => {
        // const newOperatingSystemArray: IOparatingSystemArray[] = []
        // dataOperatingSystem.map((val) => {
        //     if (
        //         val.isCheck &&
        //         !val.children.map((item) => item._id).includes(event._id)
        //     ) {
        //         val.isCheck = false
        //         val.version = ''
        //     } else if (
        //         val.children.map((item) => item._id).includes(event._id)
        //     ) {
        //         val.isCheck = true
        //         val.version = event.operatingSystemName
        //     } else {
        //         val.isCheck = false
        //         val.version = ''
        //     }
        //     val.isShow = false
        //     newOperatingSystemArray.push(val)
        // })
        // newCloudServer.operatingSystem = event._id || ''
        // setDataOperatingSystem(newOperatingSystemArray);

        setChosenOsTemplate(event)
    }

    useEffect(() => {
        const getProductByOs = async (id: string) => {
            try {
                const result = await getProductsBySubOrderPage(id)

                const { data } = result?.data
                setProducts(data || [])

                if (data?.length > 0) {
                    setChosenProduct(data?.[0] || {})
                }
            } catch (error) {
                console.log('getProductsBySubOrderPage', error)
            }
        }

        if (chosenOsTemplate?.subOrderPage)
            getProductByOs(chosenOsTemplate?.subOrderPage)
    }, [chosenOsTemplate])

    const onclickServer = (item: any) => {
        // dataServer.map((val) => {
        //     ;(val.isCheck = val._id == item._id ? true : false),
        //         iService.push(val)
        // })
        // newCloudServer.server = item._id || ''
        // setDataServer(iService)
        // setPrice(item.price || 0)
        setChosenProduct(item)
    }

    const cPrice = useMemo(() => {
        let total = 0
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

            console.log(total)
            return total
        }

        return chosenProduct[unit.id]
    }, [unit, chosenProduct, isCustomServer, CPU, RAM, DISK])

    const onclickPackageServer = (item: any) => {
        setUnit(item)
        // dataPackageServer.map((val) => {
        //     ;(val.isCheck = val._id == item._id ? true : false),
        //         iPackageServer.splice(
        //             iPackageServer.findIndex((x) => x._id == val._id),
        //             1,
        //             val
        //         )
        // })
        // onchangeLaodServer(item.status)
        // loadUnit(item.status)
        // setDataPackageServer(iPackageServer)
    }

    // const onclickRandomPassword = () => {
    //     iProfileCloudServer.splice(0, 1)
    //     dataProfileCloudServer.map((val) => {
    //         val.password = Math.random().toString(36).slice(-10)
    //         iProfileCloudServer.push(val)
    //     })
    //     newCloudServer.password = dataProfileCloudServer[0].password || ''
    //     setDataProfileCloudServer(iProfileCloudServer)
    // }

    // const onclickSamePassword = () => {
    //     const password = Math.random().toString(36).slice(-10)
    //     iProfileCloudServer.splice(0, 1)
    //     dataProfileCloudServer.map((val) => {
    //         val.password = password
    //         iProfileCloudServer.push(val)
    //     })
    //     newCloudServer.password = dataProfileCloudServer[0].password || ''
    //     setDataProfileCloudServer(iProfileCloudServer)
    // }

    // const onclickSamePort = () => {
    //     let max = 65535
    //     let min = 1024
    //     const port = Math.floor(
    //         Math.random() * (max - min + 1) + min
    //     ).toString()
    //     iProfileCloudServer.splice(0, 1)
    //     dataProfileCloudServer.map((val) => {
    //         val.port = port
    //         iProfileCloudServer.push(val)
    //     })
    //     newCloudServer.port = dataProfileCloudServer[0].port || ''
    //     setDataProfileCloudServer(iProfileCloudServer)
    // }

    // const onclickRandomPort = () => {
    //     let max = 65535
    //     let min = 1024
    //     iProfileCloudServer.splice(0, 1)
    //     dataProfileCloudServer.map((val) => {
    //         val.port = Math.floor(
    //             Math.random() * (max - min + 1) + min
    //         ).toString()
    //         iProfileCloudServer.push(val)
    //     })
    //     newCloudServer.port = dataProfileCloudServer[0].port || ''
    //     setDataProfileCloudServer(iProfileCloudServer)
    // }

    // const onClickReduce = () => {
    //     if (dataProfileCloudServer.length != 1) {
    //         dataProfileCloudServer.pop()
    //         setNumberCloud(dataProfileCloudServer.length)
    //     }
    // }

    // const onClickIncrease = () => {
    //     let ProfileCloudServerItem = {
    //         _id: dataProfileCloudServer.length + 1,
    //         cloudServerName: '',
    //         password: '',
    //         port: '',
    //     }

    //     dataProfileCloudServer.push(ProfileCloudServerItem)
    //     iProfileCloudServer.push(ProfileCloudServerItem)
    //     setDataProfileCloudServer(dataProfileCloudServer)
    //     setNumberCloud(dataProfileCloudServer.length)
    // }

    // const onchangePass = (data: IProfileCloudServer, event: string) => {
    //     let datas = dataProfileCloudServer
    //     datas.map((item) => {
    //         if (item._id === data._id) {
    //             item.password = event
    //         }
    //         dataProfileCloudServer.splice(
    //             dataProfileCloudServer.findIndex((x) => x._id === item._id),
    //             1,
    //             item
    //         )
    //     })
    //     setDataProfileCloudServer(dataProfileCloudServer)
    // }

    // const onchangeValue = (data: IProfileCloudServer, event: string) => {
    //     let datas = dataProfileCloudServer
    //     datas.map((item) => {
    //         if (item._id === data._id) {
    //             item.port = event
    //         }
    //         dataProfileCloudServer.splice(
    //             dataProfileCloudServer.findIndex((x) => x._id === item._id),
    //             1,
    //             item
    //         )
    //     })
    //     setDataProfileCloudServer(dataProfileCloudServer)
    // }

    // const onchangeNameCloud = (data: IProfileCloudServer, event: string) => {
    //     let datas = dataProfileCloudServer
    //     datas.map((item) => {
    //         if (item._id === data._id) {
    //             item.cloudServerName = event
    //         }
    //         dataProfileCloudServer.splice(
    //             dataProfileCloudServer.findIndex((x) => x._id === item._id),
    //             1,
    //             item
    //         )
    //     })
    //     setDataProfileCloudServer(dataProfileCloudServer)
    // }

    // const onChangeCPU = (value: number) => {
    //     //1 cpu 50k
    //     let price = 0
    //     if (value !== 1 && RAM !== 1 && SSD !== 30) {
    //         price =
    //             (value - 1) * priceVps.cpu +
    //             (RAM - 1) * priceVps.ram +
    //             (SSD - 30) * priceVps.ssd
    //     }
    //     if (value !== 1 && RAM !== 1) {
    //         price = (value - 1) * priceVps.cpu + (RAM - 1) * priceVps.ram
    //     } else if (value !== 1 && SSD !== 30) {
    //         price = (value - 1) * priceVps.cpu + (SSD - 30) * priceVps.ssd
    //     } else if (value === 1) {
    //         price = (RAM - 1) * priceVps.ram + (SSD - 30) * priceVps.ssd
    //     } else {
    //         price = (value - 1) * priceVps.ssd
    //     }

    //     setPriceServer(price + 130000)
    //     setPrice(price + 130000)
    //     setCPU(value)
    // }

    // const onChangeRAM = (value: number) => {
    //     //1 ram 50k
    //     let price = 0
    //     if (value !== 1 && CPU !== 1 && SSD !== 30) {
    //         price =
    //             (value - 1) * priceVps.ram +
    //             (CPU - 1) * priceVps.cpu +
    //             (SSD - 30) * priceVps.ssd
    //     } else if (CPU !== 1 && value !== 1) {
    //         price = (CPU - 1) * priceVps.cpu + (value - 1) * priceVps.ram
    //     } else if (value !== 1 && SSD !== 30) {
    //         price = (value - 1) * priceVps.ram + (SSD - 30) * priceVps.ssd
    //     } else if (value === 1) {
    //         price = (CPU - 1) * priceVps.cpu + (SSD - 30) * priceVps.ram
    //     } else {
    //         price = (value - 1) * priceVps.ram
    //     }

    //     setPriceServer(price + 130000)
    //     setPrice(price + 130000)
    //     setRAM(value)
    // }

    // const onChangeSSD = (value: number) => {
    //     //1GB ssd 1k
    //     let price = 0
    //     if (value !== 30 && CPU !== 1 && RAM !== 1) {
    //         price =
    //             (value - 30) * priceVps.ssd +
    //             (CPU - 1) * priceVps.cpu +
    //             (RAM - 1) * priceVps.ram
    //     } else if (value !== 30 && CPU !== 1) {
    //         price = (value - 30) * priceVps.ssd + (CPU - 1) * priceVps.cpu
    //     } else if (value !== 30 && RAM !== 1) {
    //         price = (value - 30) * priceVps.ssd + (RAM - 1) * priceVps.ram
    //     } else if (value === 30) {
    //         price = (CPU - 1) * priceVps.cpu + (RAM - 1) * priceVps.ram
    //     } else {
    //         price = (value - 30) * priceVps.ssd
    //     }

    //     setPriceServer(price + 130000)
    //     setPrice(price + 130000)
    //     setSSD(value)
    //     setHDD(0)
    // }

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

    // const onChangeHDD = (value: number) => {
    //     //1GB ssd 1k
    //     let price = 0
    //     if (value !== 30 && CPU !== 1 && RAM !== 1) {
    //         price = (value - 30) * 1000 + (CPU - 1) * 50000 + (RAM - 1) * 50000
    //     } else if (value !== 30 && CPU !== 1) {
    //         price = (value - 30) * 1000 + (CPU - 1) * 50000
    //     } else if (value !== 30 && RAM !== 1) {
    //         price = (value - 30) * 1000 + (RAM - 1) * 50000
    //     } else if (value === 30) {
    //         price = (CPU - 1) * 50000 + (RAM - 1) * 50000
    //     } else {
    //         price = (value - 30) * 1000
    //     }

    //     setPriceServer(price + 130000)
    //     setHDD(value)
    //     setSSD(0)
    // }

    // const createServer = async (newClS: IInserCloudServer[]) => {
    //     try {
    //         newClS.map((item: IInserCloudServer) => {
    //             if (!validate(item)) return
    //         })

    //         layout.setLoading(true)
    //         newService.serverName = 'tuy_chinh_cau_hinh_' + Date.now()
    //         newService.price = autoBackup
    //             ? priceServer + priceServer * 0.1
    //             : priceServer
    //         newService.cpu = CPU.toString() + ' vCPU'
    //         newService.ram = RAM.toString()
    //         newService.ssd = SSD ? SSD.toString() : ''
    //         newService.hdd = HDD ? HDD.toString() : ''
    //         newService.bandwidth = bandwidth.toString() + ' Gbps'
    //         newService.tranfer = tranfer
    //         newService.ipv4 = IPv4.toString() + ' Địa chỉ'
    //         newService.serverDefault = false
    //         newService.discount = 0

    //         const create = await createService(newService)
    //         if (create.data.status == 1) {
    //             //trường hợp tạo server custom và 1 cloud
    //             if (newClS.length < 2) {
    //                 if (create.data.status == 1) {
    //                     newClS[0].server = create.data.data._id
    //                     const createCloudServer = await createCloud(newClS[0])
    //                     if (createCloudServer.data.status == 1) {
    //                         notify(notifyType.NOTIFY_SUCCESS, 'Tạo thành công')
    //                         navigate('/cloud-vps')
    //                     } else {
    //                         notify(
    //                             notifyType.NOTIFY_ERROR,
    //                             createCloudServer.data.message
    //                         )
    //                     }
    //                 }
    //             } else {
    //                 //trường hợp tạo server custom và nhiều cloud
    //                 let resCout = 0
    //                 newClS.forEach(async (item) => {
    //                     const create = await createCloud(item)
    //                     if (create.data.status == 1) {
    //                         resCout++
    //                     }
    //                 })
    //                 setTimeout(() => {
    //                     notify(
    //                         notifyType.NOTIFY_SUCCESS,
    //                         `Tạo thành công ` + resCout
    //                     )
    //                 }, 1000)
    //             }
    //         } else {
    //             notify(notifyType.NOTIFY_ERROR, create.data.message)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     } finally {
    //         layout.setLoading(false)
    //     }
    // }

    // const createCloudServer = async (newClS: IInserCloudServer[]) => {
    //     try {
    //         layout.setLoading(true)
    //         if (newClS.length < 2) {
    //             if (!validate(newClS[0])) return
    //             const create = await createCloud(newClS[0])
    //             if (create.data.status == 1) {
    //                 notify(
    //                     notifyType.NOTIFY_SUCCESS,
    //                     'Tạo thành công vui lòng đợi vps khởi tạo'
    //                 )
    //                 navigate('/cloud-vps')
    //             } else {
    //                 notify(notifyType.NOTIFY_ERROR, create.data.message)
    //             }
    //         } else {
    //             let resCout = 0
    //             newClS.forEach(async (item) => {
    //                 const create = await createCloud(item)
    //                 if (create.data.status == 1) {
    //                     resCout++
    //                 }
    //             })

    //             setTimeout(() => {
    //                 notify(
    //                     notifyType.NOTIFY_SUCCESS,
    //                     `Tạo thành công vui lòng đợi vps khởi tạo` + resCout
    //                 )
    //             }, 1000)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         layout.setLoading(false)
    //     } finally {
    //         layout.setLoading(false)
    //     }
    // }

    const getProductForConfig = async () => {
        try {
            const result = await getProductDetailForConfig('17')

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

            console.log('result', {
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
                data = {
                    ...data,
                    type: 'custom',
                }
            }

            console.log('data', data)

            return
            const result = await createNewService(data)

            const { status, data: resData } = result?.data

            if (status === RESPONSE_STATUS.SUCCESS) {
                console.log('resData', resData)
            }

            notify(notifyType.NOTIFY_SUCCESS, 'Đang tạo dịch vụ vui lòng đợi')
            navigate('/cloud-vps')

            // newCloudServer.user = JSON.parse(
            //     localStorage.getItem('user') || 'null'
            // ).user._id
            // dataProfileCloudServer.map((item) => {
            //     var data: IInserCloudServer = {
            //         cloudServerName: item.cloudServerName,
            //         password: item.password,
            //         // port: item.port,
            //         user: newCloudServer.user,
            //         area: newCloudServer.area,
            //         operatingSystem: newCloudServer.operatingSystem,
            //         server: newCloudServer.server,
            //         autoBackup: autoBackup,
            //     }
            //     iInserCloudServer.push(data)
            // })
            // if (isCustomServer) {
            //     createServer(iInserCloudServer)
            // } else {
            // createCloudServer(iInserCloudServer)
            // }
        } catch (error) {
            console.log(error)
        } finally {
            layout.setLoading(false)
        }
    }

    // const validate = (data: IInserCloudServer): boolean => {
    //     if (!data.area) {
    //         notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn khu vực')
    //         return false
    //     }
    //     if (!data.operatingSystem) {
    //         notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn hệ điều hành')
    //         return false
    //     }
    //     if (!data.server && !isCustomServer) {
    //         notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn cấu hình')
    //         return false
    //     }
    //     if (!data.password) {
    //         notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập mật khẩu')
    //         return false
    //     }
    //     // if (!data.port) {
    //     //     notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập port')
    //     //     return false
    //     // }
    //     if (!data.cloudServerName) {
    //         notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập nhãn dịch vụ')
    //         return false
    //     }
    //     return true
    // }

    // const handleChangeBackup = (checked: boolean) => {
    //     if (checked) {
    //         setAutoBackup(true)
    //         return
    //     }
    //     setAutoBackup(false)
    // }

    // useEffect(() => {
    //     const appendData = () => {
    //         intData()
    //     }
    //     return appendData()
    // }, [])

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
                        {/* <>
                            {dataOperatingSystem?.map((item) => (
                                <OperatingSystem
                                    data={item}
                                    isCheck={item.isCheck}
                                    isShow={item.isShow}
                                    onchangeItem={(data) => {
                                        onchanngeOperatingSystemItem(data)
                                    }}
                                    setIsShow={(id: string) =>
                                        toggleShowing(id)
                                    }
                                />
                            ))}
                        </> */}

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
                                        {/* <div className="form-group">
                                            <label>HDD NVMe (GB):</label>
                                            <Slider
                                                onChange={onChangeHDD}
                                                defaultValue={30}
                                                min={30}
                                                max={960}
                                                value={HDD}
                                            />
                                        </div> */}
                                        <div className="form-group">
                                            <label>Hoá đơn tính theo:</label>
                                            <div>
                                                <Radio checked={priceMonth}>
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
                                                        {/* {bandwidth}  */}
                                                        Unlimited
                                                    </strong>
                                                </li>
                                                {/* <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        Tranfer:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {tranfer}
                                                    </strong>
                                                </li> */}
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        IPv4:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {IPv4} Địa chỉ
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
                        {/* <div className="server" style={{ display: 'flex', alignItems: 'center' }}>
                            <p className="create-cloud-location-title" style={{ display: 'contents' }}>
                                CẤU HÌNH CÓ SẴN
                            </p>
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
                        </div> */}
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
                {/* <div className="create-cloud-config">
                    <div className="server-config" style={{ display: 'block' }}>
                        <div className="create-cloud-location-title">
                            <p style={{ marginBottom: '10px' }}>
                                TỰ ĐỘNG BACKUP
                            </p>
                        </div>
                        <div
                            className="server-auto-backup"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Checkbox
                                checked={autoBackup}
                                onChange={(e) =>
                                    e.target.checked
                                        ? setAutoBackup(true)
                                        : setAutoBackup(false)
                                }
                            />
                            <img
                                style={{ marginLeft: '10px' }}
                                width={40}
                                height={40}
                                src="/images/server-icon.svg"
                            />
                            <p
                                style={{
                                    marginBottom: '0px',
                                    fontSize: '16px',
                                    marginLeft: '15px',
                                }}
                            >
                                Server sẽ tự động được backup (Chi phí tăng 10%)
                            </p>
                        </div>
                    </div>
                </div> */}
                {/* <div
                    className="create-cloud-server-name"
                    style={{ marginTop: '15px' }}
                >
                    <p className="create-cloud-location-title">
                        CẤU HÌNH TÊN SERVER & NHÃN
                    </p>
                    <div className="md-5">
                        <a onClick={() => onclickRandomPassword()}>
                            TẠO MẬT KHẨU NGẪU NHIÊN
                        </a>
                        <a onClick={() => onclickSamePassword()}>
                            TẠO MẬT KHẨU GIỐNG NHAU
                        </a>
                        <a onClick={() => onclickRandomPort()}>
                            TẠO PORT DỊCH VỤ NGẪU NHIÊN
                        </a>
                        <a onClick={() => onclickSamePort()}>
                            TẠO PORT DỊCH VỤ GIỐNG NHAU
                        </a>
                    </div>
                    <div className="text-warning">
                        Vui lòng chọn
                        <strong> hệ điều hành </strong>
                        trước khi tiếp tục
                    </div>
                    <div className="ng-untouched">
                        <div className="row-items">
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3 text-uppercase font-weight-bold">
                                {' '}
                                Mật khẩu{' '}
                            </div>
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3 text-uppercase font-weight-bold">
                                {' '}
                                Port dịch vụ{' '}
                            </div>
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3 text-uppercase font-weight-bold">
                                {' '}
                                Nhãn dịch vụ{' '}
                            </div>
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3 text-uppercase font-weight-bold"></div>
                        </div>
                        <div className="row pt-3 row-items ng-untouched ng-pristine ng-valid">
                            {dataProfileCloudServer?.map((item) => (
                                <ProfileCloudServer
                                    data={item}
                                    onchangePass={(data, value) => {
                                        onchangePass(data, value)
                                    }}
                                    onchangePort={(data, value) => {
                                        onchangeValue(data, value)
                                    }}
                                    onchangeName={(data, value) => {
                                        onchangeNameCloud(data, value)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div> */}
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
                                {/* <div className="deploy-summary-info">
                                    <span className="number-server">
                                        {' '}
                                        Số lượng Cloud Server:{' '}
                                    </span>
                                    <div className="add-number">
                                        <button
                                            className="instanceCountButton"
                                            type="button"
                                            onClick={() => onClickReduce()}
                                        >
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <span className="instanceCount">
                                            {numberCloud}
                                        </span>
                                        <button
                                            className="instanceCountButton"
                                            type="button"
                                            onClick={() => onClickIncrease()}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div> */}
                                <div className="deploy-summary-price">
                                    <span className="cost"> Chi phí: </span>
                                    <div>
                                        <span className="order_total">
                                            {/* {autoBackup
                                                ? ConverMoney(
                                                      price * numberCloud +
                                                          price *
                                                              numberCloud *
                                                              0.1
                                                  )
                                                : ConverMoney(
                                                      price * numberCloud
                                                  )}{' '} */}
                                            {ConverMoney(
                                                cPrice * numberCloud || 0
                                            ) || 0}
                                            đ
                                        </span>
                                        <span className="deploy-summary-price-label">
                                            /{unit?.extra}
                                        </span>
                                        <span className="order_total_spacer">
                                            &nbsp;
                                            <span className="order_total_hr">
                                                Miễn phí khởi tạo
                                            </span>
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
