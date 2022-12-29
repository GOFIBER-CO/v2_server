import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Input } from 'antd';
import { Component } from 'react';
import ICloudServer from '@/interfaces/ICloudServer'
import { HiPencilAlt } from 'react-icons/hi';
import { MdOutlineSecurity } from 'react-icons/md'
import { updateCloud, updateCloudServerName } from '@/services/apis';
import { toast } from 'react-toastify';
//@ts-ignore
const GeneralInformation = ({ data}: { data?: ICloudServer }) => {
    // console.log('handleChangeNameValue: ', handleChangeNameValue);
    const [labelName, setLabelName] = useState('')
    const [localData, setLocalData] = useState(data)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async() => {
        try {
            setIsModalOpen(false);
            // updateLabelName(labelName)
            // console.log('labelName: ', labelName);
            const result = await updateCloudServerName(localData?._id , labelName)
            console.log(result.data)
            //@ts-ignore
            setLocalData({...localData, cloudServerName: result.data?.data?.cloudServerName})
            toast.success("Sửa tên thành công")
        } catch (error) {
            console.log(error)
            toast.error("Sửa tên thất bại")
        }
    
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
                                        <img width="20" src={typeof(localData?.area.file) == 'string' ? `/images/${localData?.area.file}` : ''} />
                                        <span style={{marginLeft: '8px'}}>{localData?.area.areaName}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name"> Địa chỉ IP: </div>
                                <div>
                                    <span className="flag"></span>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        { }
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
                                            src={localData?.operatingSystem.img}
                                        />
                                        {
                                            localData?.operatingSystem
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
                                        {localData?.server.cpu}vCPU
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Bộ nhớ:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {localData?.server.ram} GB
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Ổ cứng:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {localData?.server.ssd}GB NVMe
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
                                        {localData?.server.bandwidth}TB
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 px-md-5">
                            <div className="flexlayoutdata">
                                <div className="title-name">Mã Server:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle' }}>
                                        {localData?.code}
                                    </span>
                                </div>
                            </div>

                            <div className="flexlayoutdata">
                                <div className="title-name">Tên nhãn:</div>
                                <div>
                                    <span style={{ verticalAlign: 'middle', marginRight: "5px" }}>
                                        {localData?.cloudServerName}
                                    </span>

                                    <Button type="primary"
                                        style={{
                                            border: '0px',
                                            borderBottom: '0 !important',
                                            backgroundColor: 'transparent',
                                            color: 'black',
                                            boxSizing: 'unset',
                                            // boxShadow: '0 !important',
                                            boxShadow: 'unset'
                                        }}
                                        onClick={showModal}
                                    >
                                        <HiPencilAlt size={20} style={{ cursor: "pointer" }} />
                                    </Button>
                                    <Modal
                                        title="Basic Modal"
                                        open={isModalOpen}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        <Input
                                            placeholder="Nhập tên mới"
                                            onChange={(e) => setLabelName(e.target.value)}
                                            value={labelName || localData?.cloudServerName}
                                        />
                                    </Modal>
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
