import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React from 'react'

interface DeleteModalProps {
    openDeleteModal: boolean;
    setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    ondelete: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    confirmLoading?: boolean;
}

const DeleteModal = (
    { openDeleteModal, setOpenDeleteModal, ondelete, items, confirmLoading }: DeleteModalProps
) => {
    return (
        <Modal
            title=""
            open={openDeleteModal}
            onOk={() => {
                ondelete();
            }}
            onCancel={() => {
                setOpenDeleteModal(false);
            }}
            confirmLoading={confirmLoading}
        >
            <div style={{ textAlign: 'center' }}>
                <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />
                <h2 style={{ margin: '16px 0' }}>Are you sure?</h2>
                <div>
                    You want to delete this item?<br></br>
                    <ul style={{
                        textAlign: 'left',
                        listStyleType: 'circle',
                        paddingLeft: '20%',
                        paddingRight: '20%',
                    }}>
                        {items.map((item, index) => {
                            return (
                                <li key={index}>{item}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </Modal >
    )
}

export default DeleteModal  