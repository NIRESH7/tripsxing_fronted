import { Input, Card, Space, Typography } from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
} from "@ant-design/icons";
import Logo from "@assets/logo/logo_splash.png";
import Button from './ui/Button/Button';
import { constant } from "../constants/constants";
import React, { CSSProperties, useState } from "react";
import { CreatePasswordCardProps } from "../interfaces/interfaces";
// import { Link } from "react-router-dom";

const { Title } = Typography;



const CreatePasswordCard: React.FC<CreatePasswordCardProps> = ({ submitCreatePassword }) => {
    const [createPassword, setCreatPassword] = useState({
        newPasword: '',
        confirmPassword: ''
    });



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

    const textfield1Style: CSSProperties = {
        width: "20rem",
        color: "#243271",
        fontSize: "1.25rem",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "1.5rem",
        margin: "0px 0px 0px 0px",
    };

    const textfield2Style: CSSProperties = {
        width: "20rem",
        color: "#000",
        fontSize: "1rem",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "1.5rem",
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
                    gap: "1.5rem",
                }}
            >
                <img
                    src={Logo}
                    alt="Logo"
                />
                <Space
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2rem",
                    }}
                >
                    <Space
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "1rem",
                        }}
                    >
                        <Title style={textfield1Style} level={5}>
                            Create New Password
                        </Title>
                        <Title style={textfield2Style} level={5}>
                            Your new password must be different from previous used password.
                        </Title>
                    </Space>
                    <Space style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                    }}>
                        <Title style={textfield1Style} level={5}>
                            New Password
                        </Title>
                        <Input.Password
                            style={inputStyle}
                            placeholder="Password"
                            prefix={<LockOutlined style={iconStyle} />}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone style={iconStyle} />
                                ) : (
                                    <EyeInvisibleOutlined style={iconStyle} />
                                )
                            }
                            onChange={(e) => {
                                setCreatPassword({ ...createPassword, newPasword: e.target.value });
                            }}
                        />
                        <Title style={textfield2Style} level={5}>
                            Password must contains 8 characters.
                        </Title>
                    </Space>
                    <Space style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                    }}>
                        <Title style={textfield1Style} level={5}>
                            Confirm Password
                        </Title>
                        <Input.Password
                            style={inputStyle}
                            placeholder="Confirm Password"
                            prefix={<LockOutlined style={iconStyle} />}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone style={iconStyle} />
                                ) : (
                                    <EyeInvisibleOutlined style={iconStyle} />
                                )
                            }
                            onChange={(e) => {
                                setCreatPassword({ ...createPassword, confirmPassword: e.target.value });
                            }}
                        />
                        <Title style={textfield2Style} level={5}>
                            Both Passwords must match.
                        </Title>
                    </Space>
                </Space>
                <Button
                    onClick={() => {
                        submitCreatePassword(createPassword);
                    }}
                    text="Update Password"
                    size="large"
                    backgroundColor={constant.secondaryColor as string}
                    variant={"auth"}
                />
            </Space>
        </Card>
    );
};

export default CreatePasswordCard;