import ButtonNavigator from '@/components/ButtonNavigator'
import { useAuth } from '@/hooks/useAuth'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import INotification from '@/interfaces/INotification'
import { getNotificationBySlug } from '@/services/apiv2'
import '@/styles/pages/Notification/NotificationDetail/index.scss'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { TfiMenuAlt } from 'react-icons/tfi'
import { useParams } from 'react-router'

const NotificationDetail = () => {
    const layout = useLayoutInit()
    const auth = useAuth()
    const { slug } = useParams()
    const [notification, setNotification] = useState<INotification>()

    const getNotification = async () => {
        try {
            layout.setLoading(true)
            const result = await getNotificationBySlug(
                slug || '',
            )
            setNotification(result.data?.data)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    useEffect(() => {
        getNotification()
    }, [slug])

    return (
        <div className="notification-detail">
            <div className="notification-detail-header">
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
                        <span>Chi tiết thông báo</span>
                    </li>
                </ul>
            </div>
            <div className="notification-detail-content">
                <h2 className="notification-detail-content-title">
                    Tiêu đề: {notification?.name}
                </h2>
                <p className="notification-detail-content-sender">
                    Người gửi:{' '}
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>
                        {(typeof notification?.sender != 'string' &&
                            notification?.sender?.email) ||
                            'Hệ thống'}
                    </span>
                </p>
                <p>
                    Ngày gửi:{' '}
                    <span
                        style={{ fontWeight: 600, fontSize: '16px' }}
                    >{`${moment(notification?.createdAt).format('DD-MM-YYYY')}`}</span>
                </p>
                <p>
                    {' '}
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        Nội dung:
                    </span>
                </p>
                <p
                    dangerouslySetInnerHTML={{ __html: notification?.content || '' }}
                ></p>
            </div>
            <ButtonNavigator url="/" name="Quay lại" />
        </div>
    )
}

export default NotificationDetail
