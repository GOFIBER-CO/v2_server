import '@/styles/pages/DepositCheck/DepositCheck.scss'
import { TfiMenuAlt } from 'react-icons/tfi'

const DepositCheck: React.FC = () => {
    return (
        <div className="deposit-check">
            <div className="deposit-check-header">
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
                        <span>Yêu cầu check nạp ví</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default DepositCheck
