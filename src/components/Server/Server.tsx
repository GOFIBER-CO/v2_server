import { convertDescriptionProductToObject } from '@/helpers'
import IService from '@/interfaces/IService'
import Checkbox from '../Checkbox/Checkbox'
import ConverMoney from '../Conver/ConverMoney'
import {useMemo } from 'react'
import { discount } from '@/helpers/discount'
import formatMoney from '@/helpers/formatMoney'

const Server = ({
    data,
    unit,
    onchange,
    isCheck,
}: {
    data: any
    unit: string
    onchange: (value: any) => void
    isCheck: boolean
}) => {
    const getPriceByUnit = (unit: string) => {
        return data[unit] || 0
    }

    console.log(data)

    const getBeforeDiscountPrice = () => {
        const dis = discount.find(x => x.name == data?.name)
        if(unit == 'm'){
            return dis?.m
        }else if(unit == 'a'){
            return dis?.a
        }else if(unit == 'q'){
            return dis?.q
        }else{
            return dis?.s
        }
    }

    const discountPrice = useMemo(()=>getBeforeDiscountPrice(),[unit])

    return (
        <div
            className="col-sm-6 col-md-4 col-lg-3 col-xl-2"
            onClick={() => onchange(data)}
        >
            <div className="price_box">
                <Checkbox isCheck={isCheck} />
                <div className="price_header">
                    <span>{data.name}</span>
                </div>
                <div className="price_number">
                    <p style={{textDecoration: 'line-through', marginBottom: '0px'}}>{formatMoney(discountPrice?.price || 0)}</p>
                    <div className="py-2">
                        <h4>
                            {/* { currentPrice !== undefined} ? {ConverMoney(data.price - currentPrice)} : {ConverMoney(data.price)}
                             */}
                            {/* {currentPrice && data.price
                                ? ConverMoney(
                                      data.price != undefined
                                          ? data.price
                                          : 0 - currentPrice
                                  )
                                : data.price}{' '} */}
                            {ConverMoney(getPriceByUnit(unit))}₫
                        </h4>
                        <p className='discount-percent'>-{discountPrice?.discount}%</p>
                        {/* <h4>{ConverMoney(data.price - currentPrice)} ₫</h4> */}
                    </div>
                    {/* <p className="money">
                        <span> VND</span>/{unit}
                    </p> */}
                </div>
                <div className="price_body">
                    <ul>
                        {Object.entries(
                            convertDescriptionProductToObject(data?.description)
                        ).map((value) => (
                            <li className="price_body" key={value[0]}>
                                <span className="mr-1">
                                    <i className="fa fa-microchip"></i>
                                    {value[0]}
                                </span>
                                <strong className="ml-auto">
                                    {value[1] as string}
                                </strong>
                            </li>
                        ))}
                        <li className="price_body">
                            <span className="mr-1">
                                <i className="fa fa-microchip"></i>
                                IPV4
                            </span>
                            <strong className="ml-auto">1</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Server
