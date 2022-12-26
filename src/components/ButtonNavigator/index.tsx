import { Button } from 'antd'
import { Link } from 'react-router-dom'

const ButtonNavigator = (props: { url: string; name: string }) => {
    return (
        <Link to={props.url}>
            <Button
                style={{
                    backgroundColor: '#e4e6ef',
                    color: 'black',
                    border: 'none',
                    fontWeight: '400',
                }}
                type="primary"
            >
                {props.name}
            </Button>
        </Link>
    )
}

export default ButtonNavigator
