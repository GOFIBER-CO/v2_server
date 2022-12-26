import IProfileCloudServer from '@/interfaces/IProfileCloudServer'
import { Input } from 'antd'

const ProfileCloudServer = ({
    data,
    onchangePass,
    onchangePort,
    onchangeName,
}: {
    data: IProfileCloudServer
    onchangePass: (values: string) => void
    onchangePort: (values: string) => void
    onchangeName: (values: string) => void
}) => {
    return (
        <>
            <div
                key={data._id}
                className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3"
            >
                <input
                    onChange={(e) => onchangePass(e.target.value)}
                    value={data.password ? data.password : ''}
                    type="string"
                    className="form-control ng-untouched ng-pristine ng-valid"
                    placeholder="Nhập mật khẩu"
                />
            </div>
            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3">
                <input
                    onChange={(e) => onchangePort(e.target.value)}
                    value={data.port ? data.port : ''}
                    type="string"
                    className="form-control ng-untouched ng-pristine ng-valid"
                    placeholder="Chọn port từ 1024->65535"
                />
            </div>
            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3">
                <Input
                    className="form-control ng-untouched ng-pristine ng-valid"
                    placeholder="Nhập nhãn dịch vụ mà bạn muốn"
                    onChange={(e) => onchangeName(e.target.value)}
                />
            </div>
            <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3"></div>
        </>
    )
}

export default ProfileCloudServer
