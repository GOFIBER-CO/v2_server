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
    chosenOsTemplate,
}: {
    data: any
    isShow?: boolean
    isCheck?: boolean
    onchangeItem: (values: any) => void
    setIsShow: (id: number) => void
    chosenOsTemplate: any
}) => {
    const onchange = (id: number) => {
        setIsShow(id)
    }

    const onchangeOperatingSystemItem = (event: any) => {
        if (event) {
            onchangeItem(event)
        }
    }

    return (
        <>
            {
                <div
                    className="servertype_labe"
                    onClick={(e) => {
                        e.stopPropagation()
                        onchange(data.id || '')
                    }}
                >
                    <span className="img-country">{data?.image}</span>
                    <Checkbox isCheck={isCheck} />
                    <span className="name-system">{data.name}</span>
                    <span className="version">
                        {chosenOsTemplate?.id && isCheck
                            ? chosenOsTemplate?.name
                            : 'Chọn Version'}
                    </span>
                    {isShow && (
                        <ListOperatingSystem
                            setToggle={onchange}
                            data={data?.template}
                            onchange={(data) => {
                                onchangeOperatingSystemItem(data)
                            }}
                        />
                    )}
                </div>
            }
        </>
    )
}

export default OperatingSystem
