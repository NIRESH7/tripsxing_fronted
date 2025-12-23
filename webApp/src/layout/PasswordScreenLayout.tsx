import React from "react";
import { Space } from "antd";
import Rectanlge from "../assets/Rectangle.svg";
import forgot_password_amico from "../assets/forgot-password-amico.svg";
import { PasswordScreenLayoutProps } from "../interfaces/interfaces";



const PasswordScreenLayout: React.FC<PasswordScreenLayoutProps> = ({
    rectangleStyle,
    RenderCard,
}) => {
    return (
        <Space>
            <Space
                style={{
                    ...rectangleStyle,
                    transform: "rotate(45.524deg)",
                    flexShrink: 0,
                    position: "fixed",
                    zIndex: -1,
                }}
            >
                <img
                    src={Rectanlge}
                    alt="Logo"
                    style={{ borderRadius: "6.25rem", backgroundColor: "#243271" }}
                />
            </Space>
            <Space style={{ display: 'flex', gap: '10rem' }}>
                {/* Login page art  */}
                <Space style={{ width: "100%", height: "100%", flexShrink: 0 }}>
                    <img src={forgot_password_amico} alt="Logo" />
                </Space>
                {/* Login card */}
                {
                    <RenderCard />
                    // isResetPasswordSuccess ? <CheckMailCard /> : <ForgetPasswordCard submitForgetPassword={submitForgetPassword} />
                }
            </Space>
        </Space>
    );
};

export default PasswordScreenLayout;
