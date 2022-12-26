import IPackageServer from '@/interfaces/IPackageServer'

const PackageServer = ({
    data,
    onchange,
}: {
    data: IPackageServer
    onchange: (values: IPackageServer) => void
}) => {
    return (
        <li className="package-server-item" onClick={() => onchange(data)}>
            <span className="tile-package-server-item">
                <label
                    className="name-package-server-item"
                    style={
                        data.isCheck == true
                            ? { borderBottom: '2px solid #007bfc' }
                            : {}
                    }
                >
                    {data.name}
                </label>
            </span>
        </li>
    )
}

export default PackageServer
