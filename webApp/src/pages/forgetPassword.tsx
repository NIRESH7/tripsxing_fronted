import React from "react";
import { Space } from "antd";
import Rectanlge from "../assets/Rectangle.svg";
import forgot_password_amico from "../assets/forgot-password-amico.svg";
import { useMediaQuery } from 'react-responsive'
// import { route } from "../routes/routes";
import { PostApiCustomerRoutes } from "../hooks/ApiCustomerHooks";
import Notification from '../component/ui/Toast/Toast';
import ForgetPasswordCard from "../component/ForgetPasswordCard";
import CheckMailCard from "../component/CheckMailCard";
import { route } from "../routes/routes";


const ForgetPassword: React.FC = () => {
    const [isResetPasswordSuccess, setResetPasswordSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const submitForgetPassword = async (ForgetPassword: string) => {
        setLoading(true);
        console.log(ForgetPassword);

        try {
            const res = await PostApiCustomerRoutes(route.backend.reset, {
                email: ForgetPassword,
            });
            console.log(res);
            if (res.statusCode === 200) {
                console.log("Entered");
                Notification({
                    // messageType: 'success',
                    message: 'Success',
                    description: 'password reset link sent to your mail',
                    position: 'bottom',
                    style: {},
                    duration: 20,
                });
                setResetPasswordSuccess(true);
                setLoading(false);
            } else if (res.statusCode === 400) {
                console.log("Entered");
                Notification({
                    // messageType: 'error',
                    message: 'Error',
                    description: '',
                    position: 'bottom',
                });
                setResetPasswordSuccess(false);
                setLoading(false);
            } else {
                console.log("Entered");
                Notification({
                    // messageType: 'error',
                    message: 'Error',
                    description: 'An error occurred',
                    position: 'bottom',
                });
                setResetPasswordSuccess(false);
                setLoading(false);
            }
        } catch (error) {
            console.log("Error:", error);
            Notification({
                // messageType: 'error',
                message: 'Error',
                description: 'An error occurred',
                position: 'bottom',
            });
            setResetPasswordSuccess(false);
            setLoading(false);
        }
    };

    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isLaptop = useMediaQuery({ minWidth: 992 });
    const isDesktop = useMediaQuery({ minWidth: 1200 });

    const rectangleStyle = {
        width: isDesktop ? "40%" : isLaptop ? "20%" : "20%",
        height: isDesktop ? "40%" : isLaptop ? "20%" : "20%",
        scale: isDesktop ? "1.5" : isLaptop ? "1" : "1.5",
        left: isDesktop ? "-544px" : isLaptop ? "-336px" : "-544px",
        top: isDesktop ? "456px" : isLaptop ? "322px" : "456px",
        // other styles...
    };


    return (
        <Space>
            {isMobile ? (
                isResetPasswordSuccess ? <CheckMailCard /> : <ForgetPasswordCard
                    loading={loading}
                    submitForgetPassword={submitForgetPassword} />
            ) : (
                <>
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
                            isResetPasswordSuccess ? <CheckMailCard /> : <ForgetPasswordCard
                                loading={loading}
                                submitForgetPassword={
                                    submitForgetPassword
                                } />
                        }
                    </Space>
                </>
            )}
        </Space>
    )
};


export default ForgetPassword;