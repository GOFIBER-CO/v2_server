import ConverMoney from "@/components/Conver/ConverMoney"
import { useLayoutInit } from "@/hooks/useInitLayOut"
import IPrice from "@/interfaces/IPrice"
import { getPrice } from "@/services/apis"
import "@/styles/pages/ManagePrice/index.scss"
import { Button } from "antd"
import { useEffect, useState } from "react"
import { TfiMenuAlt } from "react-icons/tfi"
import { Link } from "react-router-dom"

const ManagePrice = () => {
    const layout = useLayoutInit()

    const [price, setPrice] = useState<IPrice>()

    const getVpsPrice = async () => {
        try {
            layout.setLoading(true)
            const result = await getPrice()
            setPrice(result.data.price)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }


    useEffect(()=>{
        getVpsPrice()
    },[])   
    return (
        <div className="manage-price-page">
            <div className="manage-ip-page-header">
                <ul>
                    <li>
                        <TfiMenuAlt
                            size={15}
                            style={{
                                verticalAlign: '-3px',
                                marginRight: '8px',
                                color: '#3699ff',
                            }}
                        />
                        <span>Quản lý giá cả</span>
                    </li>
                </ul>
            </div>
            <div className = "manage-ip-content" style={{marginTop: '30px', padding: '0 20px', fontWeight: 'bold'}}>
                <p>RAM: {ConverMoney(price?.ram)}đ/GB</p>
                <p>CPU: {ConverMoney(price?.cpu)}đ/GB</p>
                <p>SSD: {ConverMoney(price?.ssd)}đ/GB</p>
                <Link to={`/manage-price/${price?._id}`}><Button type="primary" style={{marginTop: '10px', fontWeight: 'bold'}}>Chỉnh sửa giá tiền</Button></Link>
            </div>
        </div>
    )
}

export default ManagePrice