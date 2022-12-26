import { useLayoutInit } from '@/hooks/useInitLayOut'
import IDepositGuide from '@/interfaces/IDepositGuide'
import { getDepositGuide } from '@/services/apis'
import '@/styles/pages/DepositGuide/DepositGuide.scss'
import { useEffect, useState } from 'react'

const DepositGuide: React.FC = () => {
    const [depositGuide, setDepositGuide] = useState<IDepositGuide>({
        _id: '',
        content: '',
    })

    const layout = useLayoutInit()

    const getContentDepositGuide = async () => {
        try {
            layout.setLoading(true)
            const result = await getDepositGuide()
            setDepositGuide(result.data)
            layout.setLoading(false)
        } catch (error) {
            layout.setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getContentDepositGuide()
    }, [])
    return (
        <div className="deposit-guide">
            <p className="deposit-guide-title">Nạp tiền vào tài khoản</p>
            <div
                className="deposit-guide-content"
                dangerouslySetInnerHTML={{ __html: depositGuide.content }}
            ></div>
        </div>
    )
}

export default DepositGuide
