import appConfig from '@/config/appConfig'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import { useEffect, useState } from 'react'
import Checkbox from '../Checkbox/Checkbox'

const PaymentMethod = ({
    data,
    isCheck,
    onchangeItem,
}: {
    data: any
    isCheck?: boolean
    onchangeItem: (values: any) => void
}) => {
    return (
        <>
            {
                <div
                    className="servertype_labe"
                    onClick={(e) => {
                        e.stopPropagation();
                        onchangeItem(data);
                    }}
                >
                    <span className="img-country">
                        <img
                            src={data?.image}
                            style={{
                                borderRadius: '12px',
                                border: '1px solid #ddd',
                                maxWidth: '48px',
                                maxHeight: '48px',
                            }}
                            alt=""
                            width={48}
                            height={48}
                        />
                    </span>
                    <Checkbox isCheck={isCheck} />
                    <span className="name-system">{data.name}</span>
                </div>
            }
        </>
    )
}

export default PaymentMethod
