import { notify, notifyType } from "@/App"
import ConverMoney from "@/components/Conver/ConverMoney"
import { useLayoutInit } from "@/hooks/useInitLayOut"
import IPrice from "@/interfaces/IPrice"
import { getPriceById, updatePrice } from "@/services/apis"
import { Button, Input } from "antd"
import { useEffect, useState } from "react"
import { TfiMenuAlt } from "react-icons/tfi"
import { Link, useParams } from "react-router-dom"


const EditPrice = () => {
    const {id} = useParams()
    const [dataEdit, setDataEdit] = useState<IPrice>({
        ram: 0,
        ssd: 0,
        cpu: 0,
    })

    const layout = useLayoutInit()

    const getById = async () => {
        try {
            const result = await getPriceById(id?.toString() || "")
            setDataEdit(result.data.price)
        } catch (error) {
            console.log(error)
        }
    }

    const editPrice = async () => {
        try {
            layout.setLoading(true)
            const result = await updatePrice(id || '', dataEdit)
            if(result.data.price){
                notify(notifyType.NOTIFY_SUCCESS, 'Update thành công')
            }else{
                notify(notifyType.NOTIFY_ERROR, 'Update thất bại')
            }
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, 'Update thất bại')
        }
    }

    useEffect(()=>{
        getById()
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
            <div className = "manage-ip-content" style={{marginTop: '30px', fontWeight: 'bold'}}>
                <label>CPU:</label>
                <Input onChange={(e)=>setDataEdit({...dataEdit, cpu: Number(e.target.value)})} style={{marginTop: '10px', marginBottom: '10px'}} type="text" value={dataEdit?.cpu}/>
                <label>SSD:</label>
                <Input onChange={(e)=>setDataEdit({...dataEdit, ssd: Number(e.target.value)})} style={{marginTop: '10px', marginBottom: '10px'}} type="text" value={dataEdit?.ssd}/>
                <label>RAM:</label>
                <Input onChange={(e)=>setDataEdit({...dataEdit, ram: Number(e.target.value)})} style={{marginTop: '10px', marginBottom: '10px'}} type="text" value={dataEdit?.ram}/>
               <Button onClick={()=>editPrice()}  type="primary" style={{marginTop: '10px', fontWeight: 'bold'}}>Lưu</Button>
               <Link to={`/manage-price`}><Button type="primary" style={{marginTop: '10px', fontWeight: 'bold', marginLeft: '8px'}}>Quay lại</Button></Link>
            </div>
        </div>
    )
}

export default EditPrice