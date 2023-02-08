import '@/styles/pages/TransactionHistory/Transaction.scss'
import { Pagination } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import { TfiMenuAlt } from 'react-icons/tfi'

const Transaction: React.FC = () => {
    interface DataType {
        key: React.Key
        name: string
        age: number
        address: string
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'code',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
        },
        {
            title: 'Số dư trước giao dịch',
            dataIndex: 'surplus_before',
        },
        {
            title: 'Số tiền',
            dataIndex: 'money_amount',
        },
        {
            title: 'Số dư sao giao dịch',
            dataIndex: 'surplus_after',
        },
    ]
    return (
        <div className="transaction-page">
            <div className="transaction-page-header">
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
                        <span>Lịch sử giao dịch</span>
                    </li>
                </ul>
            </div>
            <div className="transaction-page-table">
                <Table columns={columns} />
                <Pagination
                    style={{ marginTop: '30px' }}
                    current={1}
                    defaultCurrent={1}
                    total={100}
                    pageSize={1}
                />
            </div>
        </div>
    )
}

export default Transaction
