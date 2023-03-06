//@ts-nocheck
import ICloudServer from '@/interfaces/ICloudServer'
import '@/styles/pages/CloudVps/RenewModal/index.scss'
import { Button, InputNumber, Radio } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import { AiOutlineSave } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { memo } from 'react'
import { getCloudServerById, renewCloudServer } from '@/services/apis'
import { expiryDateType } from '@/helpers/expiryDateType'
import formatMoney from '@/helpers/formatMoney'
import { notify, notifyType } from '@/App'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import { expiryDateTypeToNumber } from '@/helpers/expiryDateTypeToNumber'

const RenewModal = ({
    id,
    closeFunction,
}: {
    id: string
    closeFunction: () => void
}) => {
    const [quantity, setQuantity] = useState(1)
    const [cloudServer, setCloudServer] = useState<ICloudServer>()
    const [price, setPrice] = useState(0)

    const layout = useLayoutInit()

    const handleChangeQuantity = (value: number | null) => {
        if (value) {
            if (!isNaN(value) && value >= 1) {
                setQuantity(value)
            }
        }
    }

    const extendCloudServer = async () => {
        try {
            const result = await renewCloudServer(
                id,
                (cloudServer?.server.price || 1) * quantity,
                expiryDateTypeToNumber(
                    cloudServer?.server?.expiryDateType || 3
                ) * quantity
            )
            // console.log(result.data)
            notify(notifyType.NOTIFY_SUCCESS, 'Gia hạn thành công')
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, 'Gia hạn thất bại')
        }
    }

    const getCloudServer = async () => {
        try {
            const result = await getCloudServerById(id)
            setCloudServer(result.data)
            setPrice(result.data?.server?.price)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCloudServer()
    }, [])

    return (
        <div className="renew-modal-blur-glass">
            <div className="renew-modal">
                <h5 className="renew-modal-title">
                    Thay đổi hoá đơn Cloud Server {cloudServer?.cloudServerName}
                </h5>
                <p>Hoá đơn tính tiền:</p>
                <p>
                    <Radio checked /> Giá theo{' '}
                    {expiryDateType(cloudServer?.server?.expiryDateType || 1)}{' '}
                    <span style={{ color: '#3699ff', fontWeight: 600 }}>
                        {formatMoney(
                            (cloudServer?.server.price || 1) * quantity
                        )}
                    </span>
                </p>
                <p>Số lượng:</p>
                <InputNumber value={quantity} onChange={handleChangeQuantity} />
                <div className="renew-modal-button-submit">
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: '#e4e6ef',
                            border: 'none',
                            color: 'black',
                        }}
                        icon={
                            <FaTimes size={18} style={{ marginRight: '3px' }} />
                        }
                        onClick={() => closeFunction()}
                    >
                        Đóng
                    </Button>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: '#1bc5bd',
                            border: 'none',
                            marginLeft: '10px',
                        }}
                        icon={
                            <AiOutlineSave
                                size={18}
                                style={{ marginRight: '3px' }}
                            />
                        }
                        onClick={() => extendCloudServer()}
                    >
                        Lưu lại
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default memo(RenewModal)
