import IService from '@/interfaces/IService'
import Checkbox from '../Checkbox/Checkbox'
import ConverMoney from '../Conver/ConverMoney'

const Server = ({
    data,
    currentPrice,
    unit,
    onchange,
}: {
    data: IService
    currentPrice?: any
    unit: string
    onchange: (value: IService) => void
}) => {
    console.log('currentPrice: ', currentPrice)

    return (
        <div
            className="col-sm-6 col-md-4 col-lg-3 col-xl-2"
            onClick={() => onchange(data)}
        >
            <div className="price_box">
                <Checkbox isCheck={data.isCheck} />
                <div className="price_header">
                    <span>{data.serverName}</span>
                </div>
                <div className="price_number">
                    <div className="py-2">
                        <h4>
                            {/* { currentPrice !== undefined} ? {ConverMoney(data.price - currentPrice)} : {ConverMoney(data.price)}
                             */}
                            {currentPrice && data.price
                                ? ConverMoney(
                                      data.price != undefined
                                          ? data.price
                                          : 0 - currentPrice
                                  )
                                : data.price}{' '}
                            ₫
                        </h4>
                        {/* <h4>{ConverMoney(data.price - currentPrice)} ₫</h4> */}
                    </div>
                    {/* <p className="money">
                        <span> VND</span>/{unit}
                    </p> */}
                </div>
                <div className="price_body">
                    <ul>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                CPU:
                            </span>
                            <strong className="ml-auto">{data.cpu}</strong>
                        </li>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-memory"></i>
                                RAM:
                            </span>
                            <strong className="ml-auto">{data.ram}</strong>
                        </li>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                SSD:
                            </span>
                            <strong className="ml-auto">{data.ssd}</strong>
                        </li>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                Băng thông:
                            </span>
                            <strong className="ml-auto">
                                {data.bandwidth}
                            </strong>
                        </li>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                Tranfer:
                            </span>
                            <strong className="ml-auto">{data.tranfer}</strong>
                        </li>
                        <li>
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                IPv4:
                            </span>
                            <strong className="ml-auto">{data.ipv4}</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Server
