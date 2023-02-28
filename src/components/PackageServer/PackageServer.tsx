import IPackageServer from '@/interfaces/IPackageServer'

const PackageServer = ({
    data,
    onchange,
    isCheck,
}: {
    data: any
    onchange: (values: any) => void
    isCheck: boolean
}) => {
    return (
        <li className="package-server-item" onClick={() => onchange(data)}>
            <span className="tile-package-server-item">
                <strong
                    className={`name-package-server-item ${
                        isCheck ? 'active' : ''
                    }`}
                >
                    {data.name}
                </strong>
            </span>
        </li>
    )
}

export default PackageServer
