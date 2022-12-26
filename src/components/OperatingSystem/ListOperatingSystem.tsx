import IOperatingSystem from '@/interfaces/IOperatingSystem'
import IOparatingSystemArray from '@/interfaces/IOperatingSystemPage'
import { useEffect, useState } from 'react'

const ListOperatingSystem = ({
    data,
    onchange,
}: {
    data: IOparatingSystemArray
    onchange: (value: IOperatingSystem) => void
}) => {
    const [dataOperatingSystem, setDataOperatingSystem] = useState(data)
    const [isShow, setIsShow] = useState(true)

    const onclickOperatingSystemShow = (event?: IOperatingSystem) => {
        if (event) {
            data.version = event?.operatingSystemName
            setIsShow(!isShow)
            onchange(event)
        }
    }

    useEffect(() => {
        setDataOperatingSystem(data)
    }, [data])

    return (
        <>
            {isShow
                ? dataOperatingSystem?.children?.map((val) => (
                      <span
                          key={val._id}
                          className="deploy_osversioncontainer"
                          onClick={() => onclickOperatingSystemShow(val)}
                      >
                          <span className="deploy_osversionselector">
                              {' '}
                              {val.operatingSystemName}
                          </span>
                      </span>
                  ))
                : ''}
        </>
    )
}

export default ListOperatingSystem
