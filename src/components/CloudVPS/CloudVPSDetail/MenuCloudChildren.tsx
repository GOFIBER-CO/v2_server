import IMenuCloud from '@/interfaces/IMenuCloud'
import { useState } from 'react'
import { TfiClose, TfiEye, TfiMenuAlt } from 'react-icons/tfi'

const MenuCloudChildren = ({
    optionValue,
    onchange,
}: {
    optionValue: number
    onchange: (data: number) => void
}) => {
    const [optionId, setOptionId] = useState(optionValue)
    const onchangeOption = (value: number) => {
        setOptionId(value)
        onchange(value)
    }
    return (
        <ul>
            <li
                onClick={() => onchangeOption(1)}
                // style={{color:"red"}}
                style={
                    optionId === 1
                        ? { borderBottom: '2px solid #3699ff', fontWeight: 700 }
                        : {}
                }
            >
                Thông tin tổng quan quan
            </li>
            <li
                onClick={() => onchangeOption(2)}
                style={
                    optionId == 2
                        ? { borderBottom: '2px solid #3699ff', fontWeight: 700 }
                        : {}
                }
            >
                Snapshots
            </li>
            <li
                onClick={() => onchangeOption(3)}
                style={
                    optionId == 3
                        ? { borderBottom: '2px solid #3699ff', fontWeight: 700 }
                        : {}
                }
            >
                Lịch sử thanh toán
            </li>
            <li
                onClick={() => onchangeOption(4)}
                style={
                    optionId == 4
                        ? { borderBottom: '2px solid #3699ff', fontWeight: 700 }
                        : {}
                }
            >
                Lịch sử thao tác
            </li>
            <li
                onClick={() => onchangeOption(5)}
                style={
                    optionId == 5
                        ? { borderBottom: '2px solid #3699ff', fontWeight: 700 }
                        : {}
                }
            >
                Biểu đồ theo dõi
            </li>
        </ul>
    )
}

export default MenuCloudChildren
