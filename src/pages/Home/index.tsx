import Card from '@/components/Card/Card'
import '@/styles/pages/Home/Home.scss'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
    const cardStyle1: React.CSSProperties = {
        backgroundColor: '#e1f0ff',
    }
    const cardStyle2: React.CSSProperties = {
        backgroundColor: '#c9f7f4',
    }
    const buttonStyle1: React.CSSProperties = {
        backgroundColor: '#3699fe',
        color: 'white',
        fontWeight: '600',
    }
    const buttonStyle2: React.CSSProperties = {
        color: 'white',
        backgroundColor: '#19c5bd',
        fontWeight: '600',
    }
    return (
        <div className="home-components">
            <div className="home-components-card">
                <div className="home-components-card-item">
                    <Link to={'/cloud-vps/create-cloud'}>
                        <Card
                            buttonStyle={buttonStyle1}
                            cardStyle={cardStyle1}
                            cardTitle="Dịch Vụ Cloud Server"
                            cardDescription="Khởi tạo nhanh chóng, cấu hình mạnh mẽ, thay đổi linh hoạt, cung cấp toàn quyền điều khiển cho người dùng."
                            cardButtonName="Khởi tạo ngay"
                        />
                    </Link>
                </div>
                <div className="home-components-card-item">
                    <Link to={'/deposit-guide'}>
                        <Card
                            buttonStyle={buttonStyle2}
                            cardStyle={cardStyle2}
                            cardTitle="Tối ưu chi phí"
                            cardDescription="Không cần đầu tư hạ tầng. Sử dụng và chi trả theo nhu cầu. Khả năng tuỳ chỉnh cấu hình linh hoạt giúp hạn chế lãng phí tài nguyên."
                            cardButtonName="Nạp tiền ngay"
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
