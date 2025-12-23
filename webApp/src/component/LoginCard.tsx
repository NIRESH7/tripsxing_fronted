import { Input, Card, Space, Typography } from "antd";
import {
    UserOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
} from "@ant-design/icons";
import Logo from "@assets/logo/logo_splash.png";
import Button from './ui/Button/Button';
import { constant } from "../constants/constants";
import React, { CSSProperties, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { route } from "../routes/routes";
import { LoginCardProps } from "../interfaces/interfaces";
// import { SubmitLoginMutation } from "../hooks/MutationHooks";
import Notification from "./ui/Toast/Toast";
import { useCurrentUserData } from "../utils/state";
import { PostApiCustomerRoutes } from "../hooks/ApiCustomerHooks";

const { Title } = Typography;


const LoginCard: React.FC<LoginCardProps> = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loginDetails, setLoginDetails] = useState({
        username: '',
        password: ''
    });

    // const PostLoginDetails = SubmitLoginMutation()


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
        color: "#243271",
        fontSize: "0.875rem",
        fontWeight: 550,
        lineHeight: "normal",
        cursor: "pointer",
        textDecoration: "underline",
    };

    async function handleSubmit(loginDetails: { username: string; password: string; }) {
        if (loginDetails.username === '' || loginDetails.password === '') {
            Notification({
                message: 'Warning',
                description: 'Please fill all the fields',
                position: 'bottom',
            });
            return;
        }
        const data = {
            username: loginDetails.username,
            password: loginDetails.password,
            clientID: import.meta.env.VITE_WEBAPP_CLIENT_ID

        }
        try {
            setLoading(true);
            const res = await PostApiCustomerRoutes(route.backend.login, data);

            if (res.statusCode === 200) {
                localStorage.setItem('TripxingToken', res.data.token);
                delete res.data.token;
                if (res.data) {
                    localStorage.setItem('TripxingUserData', JSON.stringify(res.data));
                    useCurrentUserData.setState({ CurrentUserData: res.data })
                } else {
                    useCurrentUserData.setState({ CurrentUserData: null })
                }
                if (localStorage.getItem('TripxingToken') !== null) {
                    Notification({
                        message: 'Success',
                        description: 'Login Successful',
                        position: 'bottom',
                        style: {},
                        duration: 3,
                    });
                    setLoading(false);
                    navigate(route.frontend.dashboard);
                }
            } else if (res.statusCode === 401) {
                setLoading(false);
                Notification({
                    message: 'Error',
                    description: res.response.data.message,
                    position: 'bottom',
                });
            } else {
                setLoading(false);
                Notification({
                    message: 'Error',
                    description: res.response.data.message,
                    position: 'bottom',
                });
            }
        } catch (err) {
            console.log(err);
        }

        // PostLoginDetails.mutate(data)
    }

    useEffect(() => {

        // show Notification if token is already present
        // localStorage.getItem('TripxingToken') && 
        if (localStorage.getItem('TripxingToken') || localStorage.getItem('TripxingToken-Zoho')) {
            navigate(route.frontend.dashboard);
            Notification({
                // messageType: 'error',
                message: 'info',
                description: 'Already Logged In',
                position: 'bottom',
            });
        }

    }, []);


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
                    alignItems: "center",
                    gap: "1rem",
                }}
            >

                <img
                    src={Logo}
                    alt="Logo"
                    className='w-48 h-16 sm:w-72 sm:h-24 md:w-96 md:h-32 lg:w-96 lg:h-32 xl:w-96 xl:h-32'
                />

                <Space
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2rem",
                    }}
                >
                    <Input
                        style={inputStyle}
                        placeholder="Enter UserName"
                        prefix={<UserOutlined style={iconStyle} />}
                        onChange={(e) => {
                            setLoginDetails({ ...loginDetails, username: e.target.value });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(loginDetails);
                            }
                        }}
                    />
                    <Input.Password
                        style={inputStyle}
                        prefix={<LockOutlined style={iconStyle} />}
                        placeholder="Enter Password"
                        iconRender={(visible) =>
                            visible ? (
                                <EyeTwoTone style={iconStyle} />
                            ) : (
                                <EyeInvisibleOutlined style={iconStyle} />
                            )
                        }
                        onChange={(e) => {
                            setLoginDetails({ ...loginDetails, password: e.target.value });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit(loginDetails);
                            }
                        }}
                    />
                    <Space
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-end",
                            alignSelf: "stretch",
                            width: "20rem",
                            background: "#FFF",
                        }}
                    >
                        <Link to={route.frontend.forgetPassword}>
                            <Title style={forgotPasswordStyle} level={5}>
                                Forget Password ?
                            </Title>
                        </Link>
                    </Space>
                </Space>


                <Button
                    onClick={() => {
                        handleSubmit(loginDetails);
                    }}
                    text="Login"
                    size="large"
                    backgroundColor={constant.secondaryColor as string}
                    variant={"auth"}
                    loading={loading}
                />
            </Space>
        </Card >
    );
};

export default LoginCard;