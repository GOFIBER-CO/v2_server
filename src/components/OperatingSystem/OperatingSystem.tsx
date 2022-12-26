import appConfig from '@/config/appConfig'
import IOperatingSystem from '@/interfaces/IOperatingSystem'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import { useEffect, useState } from 'react'
import Checkbox from '../Checkbox/Checkbox'
import ListOperatingSystem from './ListOperatingSystem'

const OperatingSystem = ({
    data,
    isCheck,
    isShow,
    onchangeItem,
    setIsShow,
}: {
    data: IOparatingSystemArray
    isShow?: boolean
    isCheck?: boolean
    onchangeItem: (values: IOperatingSystem) => void
    setIsShow: (id: string) => void
}) => {
    const onchange = (id: string) => {
        setIsShow(id)
    }

    const onchangeOperatingSystemItem = (event: IOperatingSystem) => {
        if (event) {
            onchangeItem(event)
        }
    }

    return (
        <>
            {
                <div
                    className="servertype_labe"
                    onClick={() => onchange(data._id || '')}
                >
                    <span className="img-country">
                        <img
                            src={`${appConfig.API_URL_UPLOAD_FILES}/${data.file}`}
                            alt=""
                            width={48}
                            height={48}
                        />
                    </span>
                    <Checkbox isCheck={data.isCheck} />
                    <span className="name-system">
                        {data.operatingSystemName}
                    </span>
                    <span className="version">
                        {data.version ? data.version : 'Chọn Version'}
                    </span>
                    {isShow ? (
                        <ListOperatingSystem
                            data={data}
                            onchange={(data) => {
                                onchangeOperatingSystemItem(data)
                            }}
                        />
                    ) : (
                        ''
                    )}
                </div>
            }
        </>
    )
}

export default OperatingSystem
