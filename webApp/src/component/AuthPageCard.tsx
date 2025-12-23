import { Card, Space } from "antd";
import Logo from "@assets/logo/logo_splash.png";
import Button from './ui/Button/Button';
import { constant } from "../constants/constants";
import { Link } from "react-router-dom";

import { route } from "../routes/routes";


const AuthPageCard: React.FC = () => {



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
                    gap: "3rem",
                }}
            >
                <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "18.75rem", height: "5.3125rem" }}
                />
                <Link to={route.frontend.login}>
                    <Button
                        onClick={() => {

                        }}
                        text="Login with "
                        size="large"
                        backgroundColor={constant.secondaryColor as string}
                    />
                </ Link>

            </Space>
        </Card>
    );
};

export default AuthPageCard;