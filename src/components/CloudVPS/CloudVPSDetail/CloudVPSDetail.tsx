import { useEffect, useState } from 'react'
import GeneralInformation from './GeneralInformation/GeneralInformation'
import Snapshots from './Snapshots/Snapshots'
import Log from './Log/Log'
import ICloudServer from '@/interfaces/ICloudServer'
import formatDate from '@/helpers/formatDate'
import TransactionHistory from './TransactionHistory/TransactionHistory'
import {
    getLogByUserId,
    getSnapshotsByUserId,
    getTransactionHistoryByCloudId,
} from '@/services/apis'
import { useLayoutInit } from '@/hooks/useInitLayOut'
import ITransactionHistory from '@/interfaces/ITransactionHistory'
import ILog from '@/interfaces/ILog'
import MenuCloudChildren from './MenuCloudChildren'
import ISnapshots from '@/interfaces/ISnapshots'

const CloudVPSDetail = ({ data }: { data?: ICloudServer }) => {
    const layout = useLayoutInit()
    const [cloudServer, setCloudServer] = useState(data)
    const [optionId, setOptionId] = useState(1)
    //TransactionHistory
    let iTransactionHistory: ITransactionHistory[] = []
    const [transactionHistory, setTransactionHistory] =
        useState(iTransactionHistory)
    const [pageIndexTransactionHistory, setPageIndexTransactionHistory] =
        useState(1)
    const [totalPageTransactionHistory, setTotalPageTransactionHistory] =
        useState(1)
    const [pageSizeTransactionHistory, setPageSizeTransactionHistory] =
        useState(1)
    const [totalItemTransactionHistory, setTotalItemTransactionHistory] =
        useState(1)
    //log
    let iLog: ILog[] = []
    const [log, setLog] = useState(iLog)
    const [pageIndexLog, setPageIndexLog] = useState(1)
    const [totalPageLog, setTotalPageLog] = useState(1)
    const [pageSizeLog, setPageSizeLog] = useState(1)
    const [totalItemLog, setTotalItemLog] = useState(1)
    //Snapshot
    let iSnapshot: ISnapshots[] = []
    const [snapshot, setSnapshot] = useState(iSnapshot)

    const onchangeMenuChildren = (value: number) => {
        setOptionId(value)
        switch (value) {
            case 1:
                break
            case 2:
                getSnapshot()
                break
            case 3:
                getTransactionHistory()
                break
            case 4:
                getLog()
                break
            default:
                break
        }
    }

    const getTransactionHistory = async () => {
        try {
            layout.setLoading(true)
            const transactionHistory = await getTransactionHistoryByCloudId(
                cloudServer?.user,
                cloudServer?._id,
                pageIndexTransactionHistory
            )

            setTransactionHistory(transactionHistory.data?.data)
            setTotalPageTransactionHistory(transactionHistory.data?.totalPages)
            setPageSizeTransactionHistory(transactionHistory.data?.pageSize)
            setTotalItemTransactionHistory(transactionHistory.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const getLog = async () => {
        try {
            layout.setLoading(true)
            const log = await getLogByUserId(
                cloudServer?.user,
                cloudServer?._id,
                pageIndexLog
            )

            setLog(log.data?.data)
            setTotalPageLog(log.data?.totalPages)
            setPageSizeLog(log.data?.pageSize)
            setTotalItemLog(log.data?.totalItem)
            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    const getSnapshot = async () => {
        try {
            layout.setLoading(true)

            const snapshots = await getSnapshotsByUserId(
                cloudServer?.user,
                cloudServer?._id
            )
            setSnapshot(snapshots.data?.data)

            layout.setLoading(false)
        } catch (error) {
            console.log(error)
            layout.setLoading(false)
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <h1>{data?.cloudServerName}</h1>
                        <h3 className="card-label">
                            <span className="font-weight-normal font-size-base">
                                {data?.area.areaName}{' '}
                                {formatDate(data?.createdTime.toString() || '')}
                            </span>
                        </h3>
                    </div>
                    <div className="card-toolbar">
                        <div className="card-toolbar">
                            <div className="mr-5">
                                <div className="text-success">
                                    <i className="fa fa-play text-success"></i>
                                    {'  '}
                                    {data?.isShow
                                        ? 'Đang chạy'
                                        : 'Đã đóng'}{' '}
                                </div>
                            </div>

                            <button className="btn-light-primary">
                                <i className="fa fa-terminal"></i>
                            </button>

                            <button className="btn-light-info">
                                <i className="fa fa-power-off"></i>
                            </button>

                            <button className="btn-light-success">
                                <i className="fa fa-play"></i>
                            </button>

                            <button className="btn-light-warning">
                                <i className="fa fa-refresh"></i>
                            </button>

                            <button className="btn-light-danger">
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="cloud-vps-page-option"
                    style={{ marginBottom: '25px' }}
                >
                    <MenuCloudChildren
                        optionValue={optionId}
                        onchange={(data) => onchangeMenuChildren(data)}
                    />
                </div>
                {optionId == 1 ? <GeneralInformation data={data} /> : ''}
                {optionId == 2 ? (
                    <Snapshots
                        dataCloudServer={data}
                        dataSnapshots={snapshot}
                    />
                ) : (
                    ''
                )}
                {optionId == 3 ? (
                    <TransactionHistory
                        dataCloudServer={data}
                        dataTransactionHistory={transactionHistory}
                        totalPageValue={totalPageTransactionHistory}
                        pageSizeValue={pageSizeTransactionHistory}
                        totalItemValue={totalItemTransactionHistory}
                    />
                ) : (
                    ''
                )}
                {optionId == 4 ? (
                    <Log
                        data={log}
                        dataCloudServer={data}
                        totalPageValue={totalPageLog}
                        pageSizeValue={pageSizeLog}
                        totalItemValue={totalItemLog}
                    />
                ) : (
                    ''
                )}
            </div>
        </>
    )
}

export default CloudVPSDetail
