import IOperatingSystem from '@/interfaces/IOperatingSystem'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import { useEffect, useState } from 'react'

const ListOperatingSystem = ({
    data,
    onchange,
    setToggle,
}: {
    data: any[]
    onchange: (value: any) => void
    setToggle: (e: number) => void
}) => {
    // const [dataOperatingSystem, setDataOperatingSystem] = useState(data)

    const onclickOperatingSystemShow = (event?: any) => {
        if (event) {
            // data.version = event?.operatingSystemName
            setToggle(0)
            onchange(event)
        }
    }

    // useEffect(() => {
    //     setDataOperatingSystem(data)
    // }, [data])

    return (
        <>
            {data?.map((val: any) => (
                <span
                    key={val._id}
                    className="deploy_osversioncontainer"
                    onClick={(e) => {
                        e.stopPropagation()
                        onclickOperatingSystemShow(val)
                    }}
                >
                    <span className="deploy_osversionselector">
                        {val?.name}
                    </span>
                </span>
            ))}
        </>
    )
}

export default ListOperatingSystem
