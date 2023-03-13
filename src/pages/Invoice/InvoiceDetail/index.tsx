import { getInvoiceById, getInvoiceForDetail } from '@/services/apiv2'
import { Button, Image, Modal, Tag } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import '@/styles/pages/Invoice/index.scss'
import ConverMoney from '@/components/Conver/ConverMoney'
import Modalprint from '@/pages/CloudVps/Modalprint'
import { useReactToPrint } from 'react-to-print'
import moment from 'moment'
import formatMoney from '@/helpers/formatMoney'
import { dataservice } from '@/helpers/dataservices'

function InvoiceDetailPage() {
    const [invoice, setInvoice] = useState<any>({})
    const [transaction, setTransaction] = useState<any>({})
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [modal, setModal] = useState(false)
    const [modalprint, setModelPrint] = useState(false)

    const getInvoice = async (id: any) => {
        try {
            setIsLoading(true)
            const result = await getInvoiceForDetail(id)

            const { data } = result?.data

            setInvoice(data?.invoice || {})
            setTransaction(data?.transaction || {})
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (id) getInvoice(id)
    }, [id])

    
    const service = useMemo(() => {
        return dataservice.find(x => x.id == Number(id))
    }, [id])

    const renderStatus = {
        paid: (
            <div>
                <h4>Hóa đơn {invoice?.number ? `#${invoice?.number}` : service?.bill.number}</h4>
                <div>
                    <Link to={'/invoices'}>Back to invoices</Link>
                </div>
                <div className="mt-4">
                    <div>
                        <Tag color="green">
                            Đã thanh toán:{' '}
                            {(invoice?.datepaid as string)?.split(' ')[0]}
                        </Tag>
                        <Tag style={{ padding: '0px 8px' }} color="light">
                            <span style={{ color: '#000' }}>
                                {invoice?.date}
                            </span>
                        </Tag>
                    </div>
                </div>
                <div className="content">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="title">Hóa đơn {invoice?.number}</div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <div>
                                <strong>Hóa đơn </strong>
                                {invoice?.number || service?.bill.number}
                            </div>
                            <div>
                                <strong>Hóa đơn ngày </strong>
                                {invoice?.date || moment(service?.bill.createdAt).format("DD/MM/YYYY")}
                            </div>
                            <div>
                                <strong>Ngày đến hạn </strong>
                                {invoice?.duedate || moment(service?.expireDate).format("DD/MM/YYYY")}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Bên mua</strong>
                            </div>
                            <div>
                                {invoice?.client?.firstname}{' '}
                                {invoice?.client?.lastname}
                            </div>
                        </div>
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Bên bán</strong>
                            </div>
                            <div>Gofiber</div>
                        </div>
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Trạng thái</strong>
                            </div>
                            <div>Đã thanh toán</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <table>
                            <thead>
                                <tr>
                                    <th className="description">Mô tả</th>
                                    <th className="extra">Thuế</th>
                                    <th className="extra">Đơn giá</th>
                                    <th className="extra">Số lượng</th>
                                    <th
                                        style={{ textAlign: 'end' }}
                                        className="extra"
                                    >
                                        Giá
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.items ? (invoice?.items || []).map((item: any) => (
                                    <tr
                                        key={item?.id}
                                        style={{ width: '100%' }}
                                    >
                                        <td className="description">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item?.description,
                                                }}
                                            ></div>
                                        </td>
                                        <td className="extra">
                                            {Number(item?.tax) || 'Không'}
                                        </td>
                                        <td className="extra">
                                            {ConverMoney(Number(item?.amount))}{' '}
                                            đ
                                        </td>
                                        <td className="extra">
                                            {Number(item?.qty) || 'Không'}
                                        </td>
                                        <td
                                            style={{ textAlign: 'end' }}
                                            className="extra"
                                        >
                                            {ConverMoney(
                                                Number(item?.linetotal)
                                            )}{' '}
                                            đ
                                        </td>
                                    </tr>
                                )): <tr
                                    key={service?.id}
                                    style={{ width: '100%' }}
                                >
                                    <td className="description">
                                        <div
                                        >{`Thanh toán hoán đơn dịch vụ ${service?.bill.number}`}</div>
                                    </td>
                                    <td className="extra">
                                        {'Không'}
                                    </td>
                                    <td className="extra">
                                        {formatMoney(service?.price || 0)}
                                    </td>
                                    <td className="extra">
                                        {`1`}
                                    </td>
                                    <td className="extra">
                                        {formatMoney(service?.price || 0)}
                                    </td>
                                </tr>}
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            marginTop: '12px',
                            borderTop: '1px solid #ddd',
                            paddingTop: '12px',
                        }}
                    >
                        <div>
                            <strong>Tạm tính: </strong>
                              {ConverMoney(invoice?.subtotal) || formatMoney(service?.price || 0)} đ
                        </div>
                        <div className="mt-2">
                            <strong>Tín dụng: </strong>
                            {ConverMoney(invoice?.credit)} đ
                        </div>
                        <div className="mt-2">
                            <strong>
                                Tổng: {ConverMoney(Number(invoice?.grandtotal)) || formatMoney(service?.price || 0)} đ
                            </strong>
                        </div>
                        <div className="mt-4">
                            <Button onClick = {()=>setModelPrint(true)} type='primary'>Xuất hóa đơn</Button>
                        </div>
                    </div>
                    {transaction?.date && (
                        <div className="row mt-4">
                            <div>
                                <strong>Giao dịch liên quan</strong>
                            </div>
                            <div className="col col-12 mt-2">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="extra20">
                                                Ngày giao dịch
                                            </th>
                                            <th
                                                style={{ textAlign: 'center' }}
                                                className="extra20"
                                            >
                                                Hình thức thanh toán
                                            </th>
                                            <th
                                                style={{ textAlign: 'center' }}
                                                className="extra50"
                                            >
                                                Mã giao dịch
                                            </th>
                                            <th
                                                className="extra10"
                                                style={{ textAlign: 'end' }}
                                            >
                                                Số tiền
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="extra20">
                                                {
                                                    (
                                                        transaction?.date as string
                                                    )?.split(' ')[0]
                                                }
                                            </td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className="extra20"
                                            >
                                                {transaction?.module}
                                            </td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className="description"
                                            >
                                                <div>
                                                    {transaction?.trans_id}
                                                </div>
                                            </td>
                                            <td
                                                className="description"
                                                style={{ textAlign: 'end' }}
                                            >
                                                {ConverMoney(
                                                    Number(transaction?.in)
                                                ) || 0}{' '}
                                                đ
                                            </td>
                                          
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ),
        unPaid: (
            <div>
                <h4>Hóa đơn {invoice?.number ? `#${invoice?.number}` : service?.bill.number}</h4>
                <div>
                    <Link to={'/invoices'}>Back to invoices</Link>
                </div>
                <div className="mt-4 d-flex align-items-center justify-content-between">
                    <div>
                        <Tag color="red">Chưa thanh toán</Tag>
                        <Tag style={{ padding: '0px 8px' }} color="light">
                            <span style={{ color: '#000' }}>
                                {invoice?.date}
                            </span>
                        </Tag>
                    </div>
                    <div>
                        <Button onClick={() => setModal(true)} type="primary">
                            Thanh toán ngay
                        </Button>
                    </div>
                </div>
                <div className="content">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="title">Hóa đơn {invoice?.number}</div>
                        <div className="d-flex align-items-center justify-content-center flex-column">
                            <div>
                                <strong>Hóa đơn </strong>
                                {invoice?.number ? `#${invoice?.number}` : service?.bill.number}
                            </div>
                            <div>
                                <strong>Hóa đơn ngày </strong>
                                {invoice?.date || moment(service?.bill.createdAt).format("DD-MM-YYYY")}
                            </div>
                            <div>
                                <strong>Ngày đến hạn </strong>
                                {invoice?.duedate || moment(service?.bill.exipireDate).format('DD-MM-YYYY')}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Bên mua</strong>
                            </div>
                            <div>
                                {invoice?.client?.firstname}{' '}
                                {invoice?.client?.lastname}
                            </div>
                        </div>
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Bên bán</strong>
                            </div>
                            <div>Gofiber</div>
                        </div>
                        <div className="col col-12 col-md-4">
                            <div>
                                <strong>Trạng thái</strong>
                            </div>
                            <div>Chưa thanh toán</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <table>
                            <thead>
                                <tr>
                                    <th className="description">Mô tả</th>
                                    <th className="extra">Thuế</th>
                                    <th className="extra">Đơn giá</th>
                                    <th className="extra">Số lượng</th>
                                    <th className="extra">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.item ?  (invoice?.items || []).map((item: any) => (
                                    <tr
                                        key={item?.id}
                                        style={{ width: '100%' }}
                                    >
                                        <td className="description">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item?.description,
                                                }}
                                            ></div>
                                        </td>
                                        <td className="extra">
                                            {Number(item?.tax) || 'Không'}
                                        </td>
                                        <td className="extra">
                                            {ConverMoney(Number(item?.amount))}{' '}
                                            đ
                                        </td>
                                        <td className="extra">
                                            {Number(item?.qty) || 'Không'}
                                        </td>
                                        <td className="extra">
                                            {ConverMoney(
                                                Number(item?.linetotal)
                                            )}{' '}
                                            đ
                                        </td>
                                    </tr>
                                )):  <tr
                                key={service?.id}
                                style={{ width: '100%' }}
                            >
                                <td className="description">
                                    <div
                                    >{`Thanh toán hoán đơn dịch vụ ${service?.bill.number}`}</div>
                                </td>
                                <td className="extra">
                                    {'Không'}
                                </td>
                                <td className="extra">
                                    {formatMoney(service?.price || 0)}
                                </td>
                                <td className="extra">
                                    {`1`}
                                </td>
                                <td className="extra">
                                    {formatMoney(service?.price || 0)}
                                </td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                    <div
                        style={{
                            marginTop: '12px',
                            borderTop: '1px solid #ddd',
                            paddingTop: '12px',
                        }}
                    >
                        <div>
                            <strong>Tạm tính: </strong>
                            {ConverMoney(invoice?.subtotal) || formatMoney(service?.price || 0)} đ
                        </div>
                        <div className="mt-2">
                            <strong>Tín dụng: </strong>
                            {ConverMoney(invoice?.credit) || 0} đ
                        </div>
                        <div className="mt-2">
                            <strong>
                                Tổng: {ConverMoney(invoice?.total) || formatMoney(service?.price || 0)} đ
                            </strong>
                        </div>
                        <Button style={{marginTop: '10px'}} onClick = {()=>setModelPrint(true)} type='primary'>Xuất hóa đơn</Button>
                    </div>
                    
                </div>
            </div>
        ),
    }

    const componentRef = React.useRef(null)
    const onBeforeGetContentResolve = React.useRef(null)
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current
    }, [componentRef.current])

    const [none, setNone] = React.useState('')

    const handleOnBeforeGetContent = React.useCallback(() => {
        // console.log('`onBeforeGetContent` called') // tslint:disable-line no-console
        // setLoading(true);
        // setText("Loading new text...");

        return new Promise((resolve: any) => {
            onBeforeGetContentResolve.current = resolve
            setNone('hiden')
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }, [])

    const handleBeforePrint = React.useCallback(() => {
        setNone('')
        // console.log("`onBeforePrint` called"); // tslint:disable-line no-console
    }, [])

    const handleAfterPrint = React.useCallback(() => {
        // console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    }, [])


    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: 'AwesomeFileName',
        onBeforeGetContent: handleOnBeforeGetContent,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        removeAfterPrint: true,
    })

    const render = {
        loading: <div></div>,
        notLoading: (
            <div className="invoice-detail-page">
                {invoice?.status ==='Paid' || service?.status  === 'Paid'
                    ? renderStatus['paid']
                    : renderStatus['unPaid']}
            </div>
        ),
    }

    return (
        <>
            {isLoading ? render['loading'] : render['notLoading']}{' '}
            <Modalprint totalBill = {formatMoney(invoice.grandtotal || service?.price)} dateExport={moment(new Date(invoice.duedate || service?.bill.createdAt)).format("DD-MM-YYYY")} datePaid={moment(new Date(invoice.paybefore || service?.bill.exipireDate)).format("DD-MM-YYYY")} status = {invoice?.status || service?.status} billCode = {`#${invoice?.number || service?.bill.number}`} billDetail = {`Thanh toán hóa đơn #${invoice?.number || service?.bill.number}`} handleOk handlePrint = {handlePrint} componentRef = {componentRef} isModalOpen = {modalprint} handleCancel = {()=>setModelPrint(false)} none ={none}/>
            <Modal
                title="Thanh toán ngay"
                open={modal}
                width="700px"
                onCancel={() => setModal(false)}
                footer={false}
            >
                <div className="row mt-4 align-items-center">
                    <div className="col-12 col-lg-6 mt-4">
                        <div className="d-flex justify-content-center">
                            {invoice?.number ? <img
                                src={`https://manager.idcviettel.com/vietqr.php?account=5318731&bankcode=970416&amount=${invoice?.total}&noidung=${invoice?.number}`}
                                style={{
                                    height: '200px',
                                    maxWidth: '200px',
                                    border: '1px solid #ccc',
                                }}
                            /> : <Image 
                                    style={{
                                        height: '250px',
                                        maxWidth: '250px',
                                        border: '1px solid #ccc',
                                    }}
                                    src='/images/qr-acb.gif'/>}
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 mt-4">
                        <div
                            className="d-flex justify-content-center align-items-center flex-column"
                            style={{ fontWeight: '400', fontSize: '18px' }}
                        >
                            <div>Số tài khoản: 5318731</div>
                            <div>Chủ tài khoản: Nguyễn Trung Hiếu</div>
                            <div style={{textAlign: 'center'}}>Nội dung thanh toán: {invoice?.number || `Thanh toan cho hoa đơn ${service?.bill.number}`}</div>
                            <div>
                                Số tiền: {invoice?.total ? ConverMoney(invoice?.total || 0) : formatMoney(service?.price || 0)}
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
        </>
    )
}

export default InvoiceDetailPage
