import "@/styles/pages/ManagePrice/index.scss"
import { TfiMenuAlt } from "react-icons/tfi"

const ManagePrice = () => {
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
        </div>
    )
}

export default ManagePrice