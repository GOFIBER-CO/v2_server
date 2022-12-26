import IMenuCloud from '@/interfaces/IMenuCloud'
import { useState } from 'react'
import { TfiClose, TfiEye, TfiMenuAlt } from 'react-icons/tfi'

const MenuCloud = ({
    data,
    isCheck,
    onchange,
    clockCloud,
}: {
    data: IMenuCloud
    isCheck: number
    onchange: (datas: IMenuCloud) => void
    clockCloud: (datas: IMenuCloud) => void
}) => {
    let isClock = false
    const handleClockCloud = (data: IMenuCloud) => {
        clockCloud(data)
        isClock = true
    }

    const handleOnchange = (data: IMenuCloud) => {
        if (!isClock) {
            onchange(data)
        }
    }

    return (
        <>
            <li
                onClick={() => handleOnchange(data)}
                style={
                    data.optionId == isCheck
                        ? { borderBottom: '2px solid #3699ff' }
                        : {}
                }
            >
                {data.isCloud == true ? (
                    <TfiEye
                        size={15}
                        style={
                            data.optionId == isCheck
                                ? {
                                      verticalAlign: '-3px',
                                      marginRight: '8px',
                                      color: '#3699ff',
                                  }
                                : {
                                      verticalAlign: '-3px',
                                      marginRight: '8px',
                                  }
                        }
                    />
                ) : (
                    <TfiMenuAlt
                        size={15}
                        style={
                            data.optionId == isCheck
                                ? {
                                      verticalAlign: '-3px',
                                      marginRight: '8px',
                                      color: '#3699ff',
                                  }
                                : {
                                      verticalAlign: '-3px',
                                      marginRight: '8px',
                                  }
                        }
                    />
                )}
                {data.name}
                {data.isCloud == true ? (
                    <TfiClose
                        onClick={() => handleClockCloud(data)}
                        size={10}
                        style={{ marginLeft: '8px' }}
                    />
                ) : (
                    ''
                )}
            </li>
        </>
    )
}

export default MenuCloud
