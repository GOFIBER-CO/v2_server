import { useLayoutInit } from '@/hooks/useInitLayOut'
import { Button, Modal } from 'antd'
import React, { useState } from 'react'

const ModalConfirm: React.FC = () => {
    const layout = useLayoutInit()
    const handleOk = () => {
        layout.modal.dispatchFunction()
    }

    const handleCancel = () => {
        layout.setModal(false, () => {}, '', '')
    }

    return (
        <>
            <Modal
                title={layout.modal.title}
                open={layout.modal.isOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>{layout.modal.content}</p>
            </Modal>
        </>
    )
}

export default ModalConfirm
