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
                style={
                    optionId == 1 ? { borderBottom: '2px solid #3699ff' } : {}
                }
            >
                Thông tin tổng quan
            </li>
            <li
                onClick={() => onchangeOption(2)}
                style={
                    optionId == 2 ? { borderBottom: '2px solid #3699ff' } : {}
                }
            >
                Snapshots
            </li>
            <li
                onClick={() => onchangeOption(3)}
                style={
                    optionId == 3 ? { borderBottom: '2px solid #3699ff' } : {}
                }
            >
                Lịch sử thanh toán
            </li>
            <li
                onClick={() => onchangeOption(4)}
                style={
                    optionId == 4 ? { borderBottom: '2px solid #3699ff' } : {}
                }
            >
                Lịch sử thao tác
            </li>
            <li
                onClick={() => onchangeOption(5)}
                style={
                    optionId == 5 ? { borderBottom: '2px solid #3699ff' } : {}
                }
            >
                Biểu đồ theo dõi
            </li>
        </ul>
    )
}

export default MenuCloudChildren
