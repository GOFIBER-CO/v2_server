import { Image, Modal } from "antd"

interface Props {
    isShow: boolean,
    setModal: (status: boolean)=>void,
    price: string,
}

const ModalPayment = ({isShow, setModal, price}:Props) => {
    return (
        <Modal
            title="Thanh toán ngay"
            open={isShow}
            width="700px"
            onCancel={() => setModal(false)}
            footer={false}
        >
            <div className="row align-items-center">
                <div className="col-12 col-lg-6 mt-4">
                    <div className="d-flex justify-content-center">
                        <Image
                            style={{
                                height: '250px',
                                maxWidth: '250px',
                                border: '1px solid #ccc',
                            }}
                            src='/images/qr-acb.gif' />
                    </div>
                    <p className="extra text-center mt-2">(Click để phóng to)</p>
                </div>
                <div className="col-12 col-lg-6 mt-4">
                    <div
                        className="d-flex justify-content-center align-items-center flex-column"
                        style={{ fontWeight: '400', fontSize: '18px' }}
                    >
                        <div>Số tài khoản: 5318731</div>
                        <div>Chủ tài khoản: Nguyễn Trung Hiếu</div>
                        <div style={{ textAlign: 'center' }}>Nội dung thanh toán: {`Thanh toán Cloudserver`}</div>
                        <div>
                            Số tiền: {price}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-center" style={{ fontSize: '18px' }}>
                <i>
                    Quý khách vui lòng điền đúng số hoá đơn và số tiền hoặc
                    quét mã QR để thanh toán được xác nhận tự động.
                </i>
            </div>
        </Modal>
    )
}

export default ModalPayment