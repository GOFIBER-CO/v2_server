import { Button, Modal, Select, Space } from "antd";
import * as React from "react";
import { BsCheckLg } from "react-icons/bs";
import "./CloudVps.scss"
import appConfig from "@/config/appConfig";



const Modalprint = ({
    billCode,
    billDetail,
    status,
    totalBill,
    dateExport,
    datePaid,
    isModalOpen, 
    handleOk,
    handleCancel,
    handlePrint,
    componentRef,
    none = ""
}: any ) =>{
    return (
        <div style={{padding:"0px 10%"}}>
            <Modal  open={isModalOpen} footer={false} onOk={handleOk} onCancel={handleCancel} width="1000px" style={{paddingTop:'20px'}} >
                <div id="modal_Payment" ref={componentRef}>
                    <div className='modal_Payment-header'>
                        <div className='modal_Payment-header-left'>
                            <img src="./public/images/Logo.png" alt="" />
                            <div className='modal_Payment-header-left-text'>Công ty TNHH Công nghệ phần mềm {appConfig.PROJECT == 'gofiber' ? 'Gofiber' : 'Vietstack'}</div>
                        </div>
                        <div className='modal_Payment-header-right'>
                            <div style={{width:'50%'}} ></div>
                            {status == 'Paid' ?   <div className='modal_Payment-header-right-check'>
                                <BsCheckLg style={{color:'#219653'}} />
                                <span className='modal_Payment-header-right-check-text' >Đã thanh toán</span> 
                            </div> : 
                            <div className='modal_Payment-header-right-check-unpaid'>
                                <span className='modal_Payment-header-right-check-text-unpaid' >Chưa thanh toán</span> 
                            </div> 
                            }
                        </div>
                        {/* <div className='modal_Payment-header-right'>
                            <div style={{width:'50%'}} ></div>
                            <div className='modal_Payment-header-right-check-no'>
                            
                            <span className='modal_Payment-header-right-check-no-text' >Chưa thanh toán</span>
                            </div>
                        </div> */}
                    </div>
                    <div className='modal_Payment-invoice' >
                        Mã số hóa đơn: <span>{billCode}</span>
                    </div>
                    <hr className='modal_Payment-hr' />
                    <div className='modal_Payment-body'>
                        <div className='modal_Payment-body-left'>
                            <div className='modal_Payment-body-center-title' >Nhà cung cấp</div>
                            <div className='modal_Payment-body-center-text' >Công ty TNHH Công nghệ phần mềm {appConfig.PROJECT == 'gofiber' ? 'Gofiber' : 'Vietstack'}</div>
                            <div className='modal_Payment-body-center-text' >Số 131, Đường CN11, P. Sơn Kỳ, Q. Tân Phú, TPHCM</div>
                        </div>
                        <div className='modal_Payment-body-center'>
                            
                        </div>
                        <div className='modal_Payment-body-right'>
                            <div className='modal_Payment-body-right-title'>Phương thức thanh toán</div>
                            <Space style={{width:'100%'}}>
                            <Select
                                value={'ck'}
                                style={{ width:'100%', border:'1px solid #99DEEF' }}
                               
                                options={[
                                    { value: 'ck', label: 'Chuyển khoản' },
                                ]}
                                />
                            </Space>
                        </div>
                    </div>
                    <div className='modal_Payment-body1'>
                        <div className='modal_Payment-body1-left'>
                            <div className='modal_Payment-body1-left-title'>Ngày xuất</div>
                            <div className='modal_Payment-body1-left-text' >{dateExport}</div>
                        </div>
                        <div className='modal_Payment-body1-right'>
                            <div className='modal_Payment-body1-right-title'>Ngày cần thanh toán</div>
                            <div className='modal_Payment-body1-right-text' >{datePaid}</div>
                        </div>
                    </div>
                    <div className='modal_Payment-content'>
                        <div className='modal_Payment-content-title'>Nội dung hóa đơn</div>
                        <div className='modal_Payment-content-text'>
                            <div className='modal_Payment-content-text-left'>Chi tiết hóa đơn: {billDetail}</div>
                        </div>
                        <div className='modal_Payment-content-text'>
                            <div className='modal_Payment-content-text-left'>Cloud VPS 32G </div>
                            <div className='modal_Payment-content-text-right'>{totalBill}</div>
                        </div>
                        <div className='modal_Payment-content-text1'>
                            <div className='modal_Payment-content-text1-left'></div>
                            <div className='modal_Payment-content-text1-right'>
                                <div style={{width:"100%", display:'flex', textAlign:'right'}}>
                                    <span className='modal_Payment-content-text1-right-TT'>Thành tiền</span>
                                    <span className='modal_Payment-content-text1-right-number'>{totalBill}</span>
                                </div>
                            </div>
                        </div>
                        {/* <div className='modal_Payment-content-text1'>
                            <div className='modal_Payment-content-text1-left'></div>
                            <div className='modal_Payment-content-text1-right'>
                                <div style={{width:"100%", display:'flex', textAlign:'right'}}>
                                    <span className='modal_Payment-content-text1-right-TT'>10% VAT</span>
                                    <span className='modal_Payment-content-text1-right-number'>380,000 VND</span>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className='modal_Payment-content-text1'>
                            <div className='modal_Payment-content-text1-left'></div>
                            <div className='modal_Payment-content-text1-right'>
                                <div style={{width:"100%", display:'flex', textAlign:'right'}}>
                                    <span className='modal_Payment-content-text1-right-TT'>Số tiền hiện có</span>
                                    <span className='modal_Payment-content-text1-right-number'>0 VND</span>
                                </div>
                            </div>
                        </div> */}
                        <div className='modal_Payment-content-text1'>
                            <div className='modal_Payment-content-text1-left'></div>
                            <div className='modal_Payment-content-text1-right'>
                                <div style={{width:"100%", display:'flex', textAlign:'right'}}>
                                    <span className='modal_Payment-content-text1-right-TT'>Tổng cộng</span>
                                    <span className='modal_Payment-content-text1-right-number'>{totalBill}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal_Payment-footer'>
                        <div className='modal_Payment-footer-left'>* Đã bao gồm VAT</div>
                        <div className='modal_Payment-footer-right'>
                            <div style={{width:'75%'}}></div>
                            <div className='modal_Payment-footer-right-button'> <Button style={none.length ?{display:"none"} : {}}  onClick={handlePrint} type="primary">In hóa đơn</Button></div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Modalprint