import { notify, notifyType } from '@/App'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import IDepositGuide from '@/interfaces/IDepositGuide'
import { getDepositGuide, updateDepositGuide } from '@/services/apis'
import '@/styles/pages/ManageDepositGuide/index.scss'
import { Editor } from '@tinymce/tinymce-react'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'

const ManageDepositGuide = () => {
    const layout = useLayoutInit()
    const [depositGuide, setDepositGuide] = useState<IDepositGuide>({
        _id: '',
        content: '',
    })
    const updateDeposit = async () => {
        try {
            layout.setLoading(true)
            const result = await updateDepositGuide(
                depositGuide._id,
                depositGuide.content
            )
            notify(notifyType.NOTIFY_SUCCESS, result.data.message)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
            notify(notifyType.NOTIFY_ERROR, error.response.data.message)
        }
    }
    const getDeposit = async () => {
        try {
            layout.setLoading(true)
            const result = await getDepositGuide()
            setDepositGuide(result.data)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getDeposit()
    }, [])
    return (
        <div className="manage-deposit-guide-page">
            <div className="manage-deposit-guide-page-header">
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
                        <span>Hướng dẫn nạp tiền</span>
                    </li>
                </ul>
            </div>
            <div
                className="manage-deposit-guide-page-input-description"
                style={{ marginTop: '20px' }}
            >
                <p>Hướng dẫn nạp tiền: </p>
                <Editor
                    value={depositGuide.content}
                    onEditorChange={(value) =>
                        setDepositGuide({ ...depositGuide, content: value })
                    }
                />
                <Button
                    type="primary"
                    style={{ marginTop: '20px' }}
                    onClick={() => updateDeposit()}
                >
                    Cập nhật
                </Button>
            </div>
        </div>
    )
}

export default ManageDepositGuide
