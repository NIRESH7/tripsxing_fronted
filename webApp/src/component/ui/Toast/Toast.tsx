import React, { ReactNode } from 'react';
import { notification, Space } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification/interface';

const Notification: React.FC<{
    // messageType: MessageType;
    message: string;
    description: string;
    position: NotificationPlacement,
    style?: object,
    duration?: number,
}> = ({ message, description, position, style, duration }) => {
    let messageType: 'success' | 'error' | 'info' | 'warning';

    switch (message.toLowerCase()) {
        case 'success':
            messageType = 'success';
            break;
        case 'error':
            messageType = 'error';
            break;
        case 'info':
            messageType = 'info';
            break;
        case 'warning':
            messageType = 'warning';
            break;
        default:
            messageType = 'info';
            break;
    }
    console.log(style);
    const openNotification = () => {
        notification[messageType]({
            message,
            description,
            placement: position,
            style: {
                borderRadius: '0.75rem',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                color: '#545151',
                fontFamily: 'verdana',
                fontSize: '1rem',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                ...style,
            },
            duration: duration,
        });
    };

    return (
        <Space style={{ width: '100%', height: '100%' }}>
            {openNotification() as ReactNode}
        </Space>
    );
};

export default Notification;
