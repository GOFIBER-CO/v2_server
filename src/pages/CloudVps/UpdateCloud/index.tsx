import { useLayoutInit } from '@/hooks/useInitLayOut'
// import { useNavigate } from 'react-router'
import {
    getCloudServersById,
    createCloud,
    createService,
    getArea,
    getOperatingSystemChildren,
    getServer,
    updateDataOfServerInCloudServerById

} from '@/services/apis'
import '@/styles/pages/CloudVps/CreateCloud/CreateCloud.scss'
import { useEffect, useMemo, useState } from 'react'
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
import ProfileCloudServer from '@/components/CloudVPS/ProfileCloudServer/ProfileCloudServer'
import PackageServer from '@/components/PackageServer/PackageServer'
import { Radio, Slider } from 'antd'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify';
// import console from 'console'

const UpdateCloud: React.FC = () => {
    const navigate = useNavigate()
    const [currentDataById, setCurrentDataById] = useState([])
    const layout = useLayoutInit()

    const iArea: IArea[] = []
    const [dataArea, setDataArea] = useState(iArea)
    const iOparatingSystemArray: IOparatingSystemArray[] = []
    const [dataOperatingSystem, setDataOperatingSystem] = useState(
        iOparatingSystemArray
    )
    const iService: IService[] = []
    const [dataServer, setDataServer] = useState(iService)
    const iPackageServer: IPackageServer[] = []
    const [dataPackageServer, setDataPackageServer] = useState(iPackageServer)
    const [payment, setPayment] = useState(110)
    const [numberCloud, setNumberCloud] = useState(1)
    const [isCustomServer, setIsCustomServer] = useState(false)
    const iProfileCloudServer: IProfileCloudServer[] = []
    const [dataProfileCloudServer, setDataProfileCloudServer] = useState(iProfileCloudServer)
    // console.log('dataProfileCloudServer: ', dataProfileCloudServer);
    const [price, setPrice] = useState(0)
    const [unit, setUnit] = useState('Tháng')
    const [priceServer, setPriceServer] = useState(129000)
    // console.log('priceServer: ', priceServer);

    const [CPU, setCPU] = useState(1)

    const [RAM, setRAM] = useState(1)
    const [SSD, setSSD] = useState(30)
    const [bandwidth, setBandwidth] = useState(10)
    const [tranfer, setTranfer] = useState('Unlimited')
    const [IPv4, setIPv4] = useState(1)
    const [priceMonth, setPriceMonth] = useState(true);
    const [dataServerItem, setDataServerItem] = useState({})
    let iInserCloudServer: IInserCloudServer[] = []
    // const [newCloudServer, setNewCloudServer] = useState<IInserCloudServer>({
    //     cloudServerName: '',
    //     password: '',
    //     port: '',
    //     user: '',
    //     area: '',
    //     operatingSystem: '',
    //     server: '',
    // })
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
    })
    const getData = (id: any) => {
        getCloudServersById(id).then(data => {

            setCurrentDataById(data?.data?.data)
            setCPU(data?.data?.data?.server?.cpu)
            setRAM(data?.data?.data?.server?.ram)
            setSSD(data?.data?.data?.server?.ssd)
            setPriceServer(data?.data?.data?.server?.price)
        })
    }
    const { id } = useParams()
    useEffect(() => {
        if (id) {
            getData(id)
        }
    }, [])
    // 
    useEffect(() => {
        // console.log(currentDataById?.server?.price,priceServer, `hahaha`);
        //@ts-ignore
        setPayment(priceServer - currentDataById?.server?.price)
    }, [priceServer])
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

    const intData = () => {
        laodArea()
        laodOperatingSystem()
        laodServer(3)
        setDataPackageServer(iPackageServer)
        setDataProfileCloudServer(iProfileCloudServer)
    }

    const loadUnit = (expiryDateType: number) => {
        switch (expiryDateType) {
            case 1:
                setUnit('Giờ')
                break
            case 2:
                setUnit('Ngày')
                break
            case 3:
                setUnit('Tháng')
                break
            case 4:
                setUnit('Tháng')
                break
            case 5:
                setUnit('Tháng')
                break
            case 6:
                setUnit('Năm')
                break
            default:
                break
        }
    }

    const laodArea = async () => {
        try {
            layout.setLoading(true)
            const area = await getArea()
            if (!area.data) return
            //set Area defaultl id = 6357fa668e588482157019cd
            let dataArea = area.data.data.map((obj: any) =>
                obj._id === area.data?.data[0]?._id
                    ? { ...obj, isCheck: true }
                    : { ...obj, isCheck: false }
            )
            // newCloudServer.area = area.data.data.find(
            //     (item: any) => item._id === area.data?.data[0]?._id
            // )?._id
            setDataArea(dataArea)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const laodOperatingSystem = async () => {
        try {
            layout.setLoading(true)
            const operatingSystem = await getOperatingSystemChildren()
            if (!operatingSystem.data) return
            setDataOperatingSystem(operatingSystem.data.data)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const laodServer = async (expiryDateType: number) => {
        if (!expiryDateType) {
            expiryDateType = 3
        }
        try {
            layout.setLoading(true)
            const server = await getServer(expiryDateType)
            if (!server.data) return
            //set server default
            let dataPackageServers = dataPackageServer.map((obj: any) =>
                obj._id === dataPackageServer[2]._id
                    ? { ...obj, isCheck: true }
                    : { ...obj, isCheck: false }
            )
            setDataPackageServer(dataPackageServers)
            setPrice(server.data.data[0].price)
            // newCloudServer.server = server.data.data[0]._id || ''
            let dataServer = server.data.data.map((obj: any) =>
                obj._id === server.data.data[0]._id
                    ? { ...obj, isCheck: true }
                    : { ...obj, isCheck: false }
            )
            setDataServer(dataServer)

            layout.setLoading(false)
        } catch (error) {
            layout.setLoading(false)
        }
    }

    const onchangeLaodServer = async (expiryDateType: number) => {
        try {
            layout.setLoading(true)
            const server = await getServer(expiryDateType)
            if (!server.data) return
            //set server default
            let dataServer = server.data.data.map((obj: any) =>
                obj._id === server.data.data[0]._id
                    ? { ...obj, isCheck: true }
                    : { ...obj, isCheck: false }
            )
            setDataServer(dataServer)

            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const onclickArea = (item: IArea) => {
        if (item.status == 0) {
            dataArea.map((val) => {
                ; (val.isCheck = val._id == item._id ? true : false),
                    iArea.push(val)
            })
            // newCloudServer.area = item._id || ''
            setDataArea(iArea)
        }
    }

    const toggleShowing = (id: string) => {
        const newOperatingSystemArray = dataOperatingSystem.map((val) => {
            if (id == val._id) {
                if (val.isShow) val.isShow = false
                else val.isShow = true
            } else {
                val.isShow = false
            }
            return val
        })
        setDataOperatingSystem(newOperatingSystemArray)
    }

    const onchanngeOperatingSystemItem = (event: IOperatingSystem) => {
        const newOperatingSystemArray: IOparatingSystemArray[] = []
        dataOperatingSystem.map((val) => {
            if (
                val.isCheck &&
                !val.children.map((item) => item._id).includes(event._id)
            ) {
                val.isCheck = false
                val.version = ''
            } else if (
                val.children.map((item) => item._id).includes(event._id)
            ) {
                val.isCheck = true
                val.version = event.operatingSystemName
            } else {
                val.isCheck = false
                val.version = ''
            }
            val.isShow = false
            newOperatingSystemArray.push(val)
        })
        // newCloudServer.operatingSystem = event._id || ''
        setDataOperatingSystem(newOperatingSystemArray)
    }

    const onclickServer = (item: IService) => {
        // console.log('iaaatem: ', item);
        setDataServerItem(item);
        dataServer.map((val) => {
            ; (val.isCheck = val._id == item._id ? true : false),
                iService.push(val)
        })
        // newCloudServer.server = item._id || ''
        setDataServer(iService)
        setPrice(item.price || 0)
    }

    const onclickPackageServer = (item: IPackageServer) => {
        dataPackageServer.map((val) => {
            ; (val.isCheck = val._id == item._id ? true : false),
                iPackageServer.splice(
                    iPackageServer.findIndex((x) => x._id == val._id),
                    1,
                    val
                )
        })
        onchangeLaodServer(item.status)
        loadUnit(item.status)
        setDataPackageServer(iPackageServer)
    }

    const onclickRandomPassword = () => {
        iProfileCloudServer.splice(0, 1)
        dataProfileCloudServer.map((val) => {
            val.password = Math.random().toString(36).slice(-10)
            iProfileCloudServer.push(val)
        })
        // newCloudServer.password = dataProfileCloudServer[0].password || ''
        setDataProfileCloudServer(iProfileCloudServer)
    }

    const onclickSamePassword = () => {
        const password = Math.random().toString(36).slice(-10)
        iProfileCloudServer.splice(0, 1)
        dataProfileCloudServer.map((val) => {
            val.password = password
            iProfileCloudServer.push(val)
        })
        // newCloudServer.password = dataProfileCloudServer[0].password || ''
        setDataProfileCloudServer(iProfileCloudServer)
    }

    const onclickSamePort = () => {
        let max = 65535
        let min = 1024
        const port = Math.floor(
            Math.random() * (max - min + 1) + min
        ).toString()
        iProfileCloudServer.splice(0, 1)
        dataProfileCloudServer.map((val) => {
            val.port = port
            iProfileCloudServer.push(val)
        })
        // newCloudServer.port = dataProfileCloudServer[0].port || ''
        setDataProfileCloudServer(iProfileCloudServer)
    }

    const onclickRandomPort = () => {
        let max = 65535
        let min = 1024
        iProfileCloudServer.splice(0, 1)
        dataProfileCloudServer.map((val) => {
            val.port = Math.floor(
                Math.random() * (max - min + 1) + min
            ).toString()
            iProfileCloudServer.push(val)
        })
        // newCloudServer.port = dataProfileCloudServer[0].port || ''
        setDataProfileCloudServer(iProfileCloudServer)
    }

    const onClickReduce = () => {
        if (dataProfileCloudServer.length != 1) {
            dataProfileCloudServer.pop()
            setNumberCloud(dataProfileCloudServer.length)
        }
    }

    const onClickIncrease = () => {
        let ProfileCloudServerItem = {
            _id: dataProfileCloudServer.length + 1,
            cloudServerName: '',
            password: '',
            port: '',
        }

        dataProfileCloudServer.push(ProfileCloudServerItem)
        iProfileCloudServer.push(ProfileCloudServerItem)
        setDataProfileCloudServer(dataProfileCloudServer)
        setNumberCloud(dataProfileCloudServer.length)
    }

    const onchangePass = (data: IProfileCloudServer, event: string) => {
        let datas = dataProfileCloudServer
        datas.map((item) => {
            if (item._id === data._id) {
                item.password = event
            }
            dataProfileCloudServer.splice(
                dataProfileCloudServer.findIndex((x) => x._id === item._id),
                1,
                item
            )
        })
        setDataProfileCloudServer(dataProfileCloudServer)
    }

    const onchangeValue = (data: IProfileCloudServer, event: string) => {
        let datas = dataProfileCloudServer
        datas.map((item) => {
            if (item._id === data._id) {
                item.port = event
            }
            dataProfileCloudServer.splice(
                dataProfileCloudServer.findIndex((x) => x._id === item._id),
                1,
                item
            )
        })
        setDataProfileCloudServer(dataProfileCloudServer)
    }

    const onchangeNameCloud = (data: IProfileCloudServer, event: string) => {
        let datas = dataProfileCloudServer
        datas.map((item) => {
            if (item._id === data._id) {
                item.cloudServerName = event
            }
            dataProfileCloudServer.splice(
                dataProfileCloudServer.findIndex((x) => x._id === item._id),
                1,
                item
            )
        })
        setDataProfileCloudServer(dataProfileCloudServer)
    }

    const onChangeCPU = (value: number) => {
        setDataServerItem({})
        // console.log('value: ', value);
        //1 cpu 50k
        let price = 0
        if (value !== 1 && RAM !== 1 && SSD !== 30) {
            price = (value - 1) * 50000 + (RAM - 1) * 50000 + (SSD - 30) * 1000
        }
        if (value !== 1 && RAM !== 1) {
            price = (value - 1) * 50000 + (RAM - 1) * 50000
        } else if (value !== 1 && SSD !== 30) {
            price = (value - 1) * 50000 + (SSD - 30) * 1000
        } else if (value === 1) {
            price = (RAM - 1) * 50000 + (SSD - 30) * 1000
        } else {
            price = (value - 1) * 50000
        }

        setPriceServer(price + 130000)
        setCPU(value)
    }

    const onChangeRAM = (value: number) => {
        setDataServerItem({})
        //1 ram 50k
        let price = 0
        if (value !== 1 && CPU !== 1 && SSD !== 30) {
            price = (value - 1) * 50000 + (CPU - 1) * 50000 + (SSD - 30) * 1000
        } else if (CPU !== 1 && value !== 1) {
            price = (CPU - 1) * 50000 + (value - 1) * 50000
        } else if (value !== 1 && SSD !== 30) {
            price = (value - 1) * 50000 + (SSD - 30) * 1000
        } else if (value === 1) {
            price = (CPU - 1) * 50000 + (SSD - 30) * 1000
        } else {
            price = (value - 1) * 50000
        }

        setPriceServer(price + 130000)
        setRAM(value)
    }

    const onChangeSSD = (value: number) => {
        setDataServerItem({})
        //1GB ssd 1k
        let price = 0
        if (value !== 30 && CPU !== 1 && RAM !== 1) {
            price = (value - 30) * 1000 + (CPU - 1) * 50000 + (RAM - 1) * 50000
        } else if (value !== 30 && CPU !== 1) {
            price = (value - 30) * 1000 + (CPU - 1) * 50000
        } else if (value !== 30 && RAM !== 1) {
            price = (value - 30) * 1000 + (RAM - 1) * 50000
        } else if (value === 30) {
            price = (CPU - 1) * 50000 + (RAM - 1) * 50000
        } else {
            price = (value - 30) * 1000
        }

        setPriceServer(price + 130000)
        setSSD(value)
    }
    const onHandleClick = async () => {
        // console.log(`hahaha`);
        setIsCustomServer(!isCustomServer)
        // await setDataServerItem({})
        // console.log('DataServerItem: ', dataServerItem);
    }
    const createServer = async (newClS: IInserCloudServer[]) => {
        try {
            newClS.map((item: IInserCloudServer) => {
                if (!validate(item)) return
            })

            layout.setLoading(true)
            newService.serverName = 'tuy_chinh_cau_hinh_' + Date.now()
            newService.price = priceServer
            newService.cpu = CPU.toString() + ' vCPU'
            newService.ram = RAM.toString() + ' GB'
            newService.ssd = SSD.toString() + ' GB'
            newService.bandwidth = bandwidth.toString() + ' Gbps'
            newService.tranfer = tranfer
            newService.ipv4 = IPv4.toString() + ' Địa chỉ'
            newService.serverDefault = false
            newService.discount = 0

            const create = await createService(newService)
            if (create.data.status == 1) {
                //trường hợp tạo server custom và 1 cloud
                if (newClS.length < 2) {
                    if (create.data.status == 1) {
                        newClS[0].server = create.data.data._id
                        const createCloudServer = await createCloud(newClS[0])
                        if (createCloudServer.data.status == 1) {
                            notify(notifyType.NOTIFY_SUCCESS, 'Tạo thành công')
                        } else {
                            notify(
                                notifyType.NOTIFY_ERROR,
                                createCloudServer.data.message
                            )
                        }
                    }
                } else {
                    //trường hợp tạo server custom và nhiều cloud
                    let resCout = 0
                    newClS.forEach(async (item) => {
                        const create = await createCloud(item)
                        if (create.data.status == 1) {
                            resCout++
                        }
                    })
                    setTimeout(() => {
                        notify(
                            notifyType.NOTIFY_SUCCESS,
                            `Tạo thành công ` + resCout
                        )
                    }, 1000)
                }
            } else {
                notify(notifyType.NOTIFY_ERROR, create.data.message)
            }
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        } finally {
            layout.setLoading(false)
        }
    }


    const onFinish = async () => {
        //@ts-ignore
        // console.log('priceServer: ', priceServer ,currentDataById?.server?.price,dataServerItem?.price );
        if (priceServer > currentDataById?.server?.price || priceServer < dataServerItem?.price) {
            try {
                //@ts-ignore
                if (dataServerItem?._id) {
                    //@ts-ignore
                    // TH1: Chọn mặc định
                    const result = await updateDataOfServerInCloudServerById(currentDataById?._id, dataServerItem);
                    if (result?.data?.status === 1) {
                        toast.success("Nâng cấp cấu hình thành công.")
                    }
                } else {
                    //TH2: Tùy chỉnh
                    newService.serverName = 'tuy_chinh_cau_hinh_' + Date.now()
                    newService.price = priceServer
                    newService.cpu = CPU.toString()
                    newService.ram = RAM.toString()
                    newService.ssd = SSD.toString()
                    newService.bandwidth = bandwidth.toString()
                    newService.tranfer = tranfer
                    newService.ipv4 = IPv4.toString()
                    newService.serverDefault = false
                    newService.discount = 0

                    const create = await createService(newService)

                    if (create?.data?.data) {
                        const result = await updateDataOfServerInCloudServerById(id, create?.data?.data);

                        if (result?.data?.status === 1) {
                            toast.success("Nâng cấp cấu hình thành công.")
                        }
                    } else {
                        toast.error("khong co create?.data?.data")
                    }


                }
                // navigate(`/cloud-vps/update-cloud/${id}`)
                navigate(`/cloud-vps`)


            } catch (error) {
                console.log(error)
            }

        } else {

            toast.error("Cấu hình nâng cấp phải lớn  hơn cấu hình ban đầu .")
        }
    }

    const validate = (data: IInserCloudServer): boolean => {
        if (!data.area) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn khu vực')
            return false
        }
        if (!data.operatingSystem) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn hệ điều hành')
            return false
        }
        if (!data.server && !isCustomServer) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng chọn cấu hình')
            return false
        }
        if (!data.password) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập mật khẩu')
            return false
        }
        if (!data.port) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập port')
            return false
        }
        if (!data.cloudServerName) {
            notify(notifyType.NOTIFY_ERROR, 'Vui lòng nhập nhãn dịch vụ')
            return false
        }
        return true
    }

    useEffect(() => {
        const appendData = () => {
            intData()
        }
        return appendData()
    }, [])

    return (
        <>
            <div className="create-cloud">
                {isCustomServer ? (
                    <div className="create-cloud-config">
                        <div className="server">
                            <p className="create-cloud-location-title">
                                TUỲ CHỈNH CẤU HÌNH
                            </p>
                            <div className="deploy_title">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => onHandleClick()}
                                // onClick={() =>
                                //     setIsCustomServer(!isCustomServer)
                                //     // setDataServerItem({})
                                // }
                                >
                                    Tuỳ chỉnh cấu hình{' '}
                                </button>
                            </div>
                        </div>
                        <div className="deploy_options">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>CPU (vCPUs)</label>
                                            <Slider
                                                onChange={onChangeCPU}
                                                defaultValue={CPU}
                                                // value={currentDataById?.server?.cpu}
                                                min={1}
                                                max={32}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>RAM (GB):</label>
                                            <Slider
                                                onChange={onChangeRAM}
                                                defaultValue={RAM}
                                                min={1}
                                                max={8}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>SSD NVMe (GB)::</label>
                                            <Slider
                                                onChange={onChangeSSD}
                                                defaultValue={SSD}
                                                min={30}
                                                max={960}
                                            />
                                        </div>
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
                                <div className="col-md-5">
                                    <div className="price_box">
                                        <div className="price_header">
                                            <span>Tùy Chỉnh Cấu Hình</span>
                                        </div>
                                        <div className="price_number" style={{ display: payment > 0 ? "block" : "none" }}>
                                            <div className="py-2" >
                                                <h4>
                                                    <span style={{
                                                        color: 'rgb(94,95,132)',
                                                        fontSize: '1.5rem',
                                                        marginRight: '0.3rem'
                                                    }}>Phí:</span>
                                                    {ConverMoney(payment)}	₫
                                                </h4>
                                            </div>
                                            <p className="money">
                                                {/* <span> VND</span>/{unit} */}
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
                                                        {/* {currentDataById?.server?.cpu} vCPU */}
                                                        {CPU} vCPU
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-memory"></i>
                                                        RAM:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {/* {currentDataById?.server?.ram} GB */}
                                                        {RAM} GB

                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        SSD:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {/* {currentDataById?.server?.ssd} GB */}
                                                        {SSD} GB
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        Băng thông:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {bandwidth} Gbps
                                                    </strong>
                                                </li>
                                                <li>
                                                    <span className="mr-1">
                                                        <i className="fa fa-microchip"></i>
                                                        Tranfer:
                                                    </span>
                                                    <strong className="ml-auto">
                                                        {tranfer}
                                                    </strong>
                                                </li>
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
                        <div className="server">
                            <p className="create-cloud-location-title">
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
                        </div>
                        <div className="package-server">
                            <div className="tabs-container">
                                <ul className="list-package-server">
                                    {dataPackageServer.map((item) => (
                                        <PackageServer
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

                                {dataServer?.map((item) => {
                                    //@ts-ignore
                                    // console.log(`itemjhafjewjfew`, item)
                                    return (item?.price > currentDataById?.server?.price &&
                                        <Server

                                            data={item}
                                            unit={unit}
                                            onchange={(data) => {
                                                onclickServer(data)
                                            }}
                                        />)
                                }
                                    //@ts-ignore
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="create-cloud-caculate-price">
                    <div className="sidebar-info">
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
                            <span className="cost" style={{
                                fontWeight: '500',
                                fontSize: '0.9rem'
                                //@ts-ignore
                            }}> IP: {currentDataById?.server?.ipv4} </span>
                            <div>

                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '500',
                                    color: 'rgb(0,123,252)'
                                }}>VSK008_16</span><span style={{
                                    fontSize: '1rem',
                                    marginLeft: '0.3rem',
                                    fontWeight: '400'
                                }}>({CPU} vCPUs | {RAM} GB | {SSD} GB nvmE)</span>
                            </div>
                        </div>
                        <input
                            onClick={() => onFinish()}
                            type="button"
                            className="responsive-full-width"
                            value="Nâng cấp cấu hình"
                        ></input>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateCloud
