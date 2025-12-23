import { Input, Card, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Logo from "@assets/logo/logo_splash.png";
import Button from "./ui/Button/Button";
import { constant } from "../constants/constants";
import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import { ForgetPasswordCardProps } from "../interfaces/interfaces";
import { route } from "../routes/routes";

const { Title } = Typography;



const ForgetPasswordCard: React.FC<ForgetPasswordCardProps> = ({
    loading,
    submitForgetPassword,
}) => {
    const [ForgetPassword, setForgetPassword] = useState('');

    const inputStyle = {
        display: "flex",
        alignItems: "center",
        width: "20rem",
        padding: "0.75rem 1.5rem",
        gap: "0.75rem",
        borderRadius: "0.75rem",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        color: "#545151",
        fontFamily: "verdana",
        fontSize: "1rem",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
    };

    const iconStyle = {
        color: "#243271",
        fontSize: "1.3rem",
    };

    const forgotPasswordStyle: CSSProperties = {
        width: "20rem",
        color: "#243271",
        fontSize: "1.25rem",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "1.5rem",
        margin: "0px 0px 0px 0px",
    };

    const forgotPasswordDescription: CSSProperties = {
        width: "20rem",
        color: "#000",
        fontSize: "1rem",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "1.5rem",
        margin: "0px 0px 0px 0px",
    };
    const backtoLoginStyle: CSSProperties = {
        color: "#243271",
        fontFamily: "Verdana",
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: "normal",
        textDecoration: "underline",
        cursor: "pointer",
        textAlign: "center",
        margin: "0px 0px 0px 0px",
    };
    return (
        <Card style={{ border: "0px" }}>
            <Space
                style={{
                    borderRadius: "1.25rem",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
                    display: "inline-flex",
                    padding: "5rem",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2.5rem",
                }}
            >
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "18.75rem", height: "5.3125rem" }}
                />
                <Space
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "1rem",
                    }}
                >
                    <Title style={forgotPasswordStyle} level={5}>
                        Forget Password ?
                    </Title>
                    <Title style={forgotPasswordDescription} level={5}>
                        Enter the Email address associated with your account and
                        we shall send you a link to reset password
                    </Title>
                </Space>
                <Input
                    style={inputStyle}
                    placeholder="Enter your email"
                    prefix={<UserOutlined style={iconStyle} />}
                    onChange={(e) => {
                        setForgetPassword(e.target.value);
                    }}
                />

                <Space
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <Button
                        onClick={() => {
                            submitForgetPassword(ForgetPassword);
                        }}
                        text="Reset Password"
                        size="large"
                        backgroundColor={constant.secondaryColor as string}
                        variant={"auth"}
                        loading={loading}
                    />
                    <Link to={route.frontend.login}>
                        <Title style={backtoLoginStyle} level={5}>
                            Back to Login
                        </Title>
                    </Link>
                </Space>
            </Space>
        </Card>
    );
};

export default ForgetPasswordCard;
