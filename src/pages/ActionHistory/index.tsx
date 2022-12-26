import ButtonFilter from '@/components/ButtonFilter'
import '@/styles/pages/ActionHistory/ActionHistory.scss'
import { AutoComplete, Input, Pagination, Select } from 'antd'
import { TfiMenuAlt } from 'react-icons/tfi'
import Table, { ColumnsType } from 'antd/lib/table'

const { Option } = Select

const ActionHistory: React.FC = () => {
    interface DataType {
        key: React.Key
        name: string
        age: number
        address: string
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Đối tượng',
            dataIndex: 'object',
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
        },
        {
            title: 'Thời gian thực hiện',
            dataIndex: 'created_date',
        },
        {
            title: 'Thời gian hoàn thành',
            dataIndex: 'finished_date',
        },
    ]
    const onFiltered = () => {
        console.log('Filtered')
    }
    return (
        <div className="action-history-page">
            <div className="action-history-page-header">
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
                        <span>Lịch sử thao tác</span>
                    </li>
                </ul>
            </div>
            <div className="action-history-page-filter">
                <div className="action-history-page-filter-general">
                    <Input
                        type="text"
                        placeholder="Từ khóa.."
                        onChange={(e) => {}}
                    />
                </div>
                <div className="action-history-page-filter-button">
                    <ButtonFilter buttonOnclick={onFiltered} />
                </div>
            </div>
            <div className="action-history-page-table">
                <Table
                    columns={columns}
                    scroll={{ x: '1000px', y: '600px' }}
                    pagination={false}
                />
                <Pagination
                    style={{ marginTop: '30px' }}
                    simple
                    defaultCurrent={2}
                    total={50}
                />
            </div>
        </div>
    )
}

export default ActionHistory
