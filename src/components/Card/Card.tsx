import '@/styles/components/Card.scss'

interface ICard {
    cardStyle?: React.CSSProperties
    buttonStyle?: React.CSSProperties
    cardTitle: string
    cardButtonName: string
    cardDescription: string
}

const Card: React.FC<ICard> = (props) => {
    return (
        <div style={props.cardStyle} className="card-component">
            <div className="card-component-content">
                <p className="card-component-title">{props.cardTitle}</p>
                <p className="card-component-description">
                    {props.cardDescription}
                </p>
            </div>
            <div className="card-component-button">
                <button style={props.buttonStyle}>
                    {props.cardButtonName}
                </button>
            </div>
        </div>
    )
}

export default Card
