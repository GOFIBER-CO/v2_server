import { Button, Result } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const ErrorPage: React.FC = () => {
    const navigate = useNavigate()
    const [counting, setCounting] = useState(3)

    useEffect(() => {
        const a = setTimeout(() => {
            navigate('/')
        }, 4000)

        const b = setInterval(() => {
            setCounting((counting) => counting - 1)
        }, 1000)

        return () => {
            clearTimeout(a)
            clearInterval(b)
        }
    }, [])
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <>
                    <p>Redirect to home page in {counting}s</p>
                    <Button type="primary" onClick={() => navigate('/')}>
                        Back Home
                    </Button>
                </>
            }
        />
    )
}

export default ErrorPage
