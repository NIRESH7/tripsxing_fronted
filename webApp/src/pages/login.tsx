import React from "react";
import { Space } from "antd";
import Rectanlge from "../assets/Rectangle.svg";
import LoginScreenArt from "../assets/loginScreenArt.svg";
import { useMediaQuery } from 'react-responsive'
import LoginCard from "../component/LoginCard";



const Login: React.FC = () => {

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
        <Space >
            {isMobile ? (
                <LoginCard />
            ) : (
                <>
                    <Space
                        style={{
                            ...rectangleStyle,
                            transform: "rotate(45.524deg)",
                            flexShrink: 0,
                            position: "fixed",
                            zIndex: -1,
                            // overflow: "hidden",
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
                            <img src={LoginScreenArt} alt="Logo" />
                        </Space>
                        {/* Login card */}
                        <LoginCard />
                    </Space>
                </>
            )}
        </Space>
    )
};

export default Login;
