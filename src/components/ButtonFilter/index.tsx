import { Button } from 'antd'
import { BiSearch } from 'react-icons/bi'

const ButtonFilter: React.FC<{ buttonOnclick: () => void }> = (props) => {
    return (
        <Button
            onClick={() => props.buttonOnclick()}
            type="primary"
            icon={<BiSearch />}
            style={{ display: 'flex', alignItems: 'center' }}
        >
            <span style={{ marginLeft: '5px' }}>Lọc</span>
        </Button>
    )
}

export default ButtonFilter
