import appConfig from '@/config/appConfig'
import IArea from '@/interfaces/IArea'
import Checkbox from '../Checkbox/Checkbox'

const Area = ({
    data,
    onchange,
}: {
    data: IArea
    onchange: (value: IArea) => void
}) => {
    return (
        <label
            style={
                data.status == 1 ? { backgroundColor: 'rgb(142 142 142)' } : {}
            }
            className="area-item"
            onClick={() => onchange(data)}
        >
            <span className="img-country">
                {data.file ? (
                    <img
                        src={`${data.file}`}
                        alt="no img"
                        width={55}
                        height={48}
                    />
                ) : (
                    ''
                )}
            </span>
            <Checkbox isCheck={data.isCheck} />
            <div className="deploy_checkbox_lines">
                <span className="name-area">
                    <span>{data.areaName}</span>
                </span>
                <span className="country">{data.country}</span>
            </div>
        </label>
    )
}

export default Area
