import ICloudServer from '@/interfaces/ICloudServer'

const GeneralInformation = ({ data }: { data?: ICloudServer }) => {
    return (
        <>
            <div className="tab-content">
                <div className="server-details">
                    <div className="row">
                        <div className="col-md-4 px-md-5">
                            <div className="flexlayoutdata">
                                <div className="title-name">Location: </div>
                                <div>
                                    <span className="flag"></span>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        <img width="20" src={`/images/${data?.area.file || ''}`}/>
                                        <span style={{marginLeft: '5px'}}>{data?.area.areaName}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name"> Địa chỉ IP: </div>
                                <div>
                                    <span className="flag"></span>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {}
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name"> Tài khoản: </div>
                                <div>
                                    <span className="flag"></span>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        root
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name"> Mật khẩu: </div>
                                <div>
                                    <span className="flag"></span>
                                    <span
                                        style={{ verticalAlign: 'middle' }}
                                        typeof="password"
                                    >
                                        ********
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">
                                    {' '}
                                    Hệ điều hành:{' '}
                                </div>
                                <div>
                                    <span className="flag"></span>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        <img
                                            width="20"
                                            src={data?.operatingSystem.img}
                                        />
                                        {
                                            data?.operatingSystem
                                                .operatingSystemName
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 px-md-5">
                            <div className="flexlayoutdata">
                                <div className="title-name">Số vCpu:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {data?.server.cpu}vCPU
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Bộ nhớ:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {data?.server.ram} GB
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Ổ cứng:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {data?.server.ssd}GB NVMe
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Băng thông:</div>
                                <div>
                                    <span
                                        style={{ verticalAlign: 'middle' }}
                                        typeof="password"
                                    >
                                        {data?.server.bandwidth}TB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 px-md-5">
                            <div className="flexlayoutdata">
                                <div className="title-name">Mã Server:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {data?.code}
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Tên nhãn:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {data?.cloudServerName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeneralInformation
