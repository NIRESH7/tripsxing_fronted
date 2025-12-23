import { Card, Space, Typography } from "antd";
import Logo from "@assets/logo/logo_splash.png";

import React, { CSSProperties } from "react";
// import { Link } from "react-router-dom";

import Succes_Ticket from "../assets/Succes_Ticket.svg";
// import { constant } from "../constants/constants";
// import { route } from "../routes/routes";
const { Title } = Typography;

// interface CheckMailCardProps {
//     submitForgetPassword: (ForgetPassword: string) => void;
// }

const CheckMailCard: React.FC = () => {
  // const [ForgetPassword, setForgetPassword] = useState('');
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
  // const textfield3Style: CSSProperties = {
  //     color: "#000",
  //     textAlign: "center",
  //     fontFamily: "Verdana",
  //     fontSize: "1rem",
  //     fontStyle: "normal",
  //     fontWeight: 400,
  //     lineHeight: "normal",
  //     margin: "0px 0px 0px 0px",
  // };
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
          <Title style={textfield1Style} level={5}>
            Check Your Mail
          </Title>
          <Title style={textfield2Style} level={5}>
            We have sent a reset password link to your mail.
          </Title>
        </Space>
        <Space
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Space
            style={{
              display: "flex",
              width: "20rem",
              height: "3rem",
              padding: "0.25rem 0rem",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={Succes_Ticket} alt="Logo" />
          </Space>
          {/* <Space >
                        <Title style={textfield3Style} level={5}>
                            Didn’t receive the link?
                        </Title>
                        <Link to={route.frontend.login}>
                            <Title style={{
                                color: constant.secondaryColor as string,
                                fontFamily: "Verdana",
                                fontSize: "1rem",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                                textDecorationLine: "underline",
                                margin: "0px 0px 0px 0px",
                            }} level={5}>
                                Resend
                            </Title>
                        </Link>
                    </Space> */}
        </Space>
      </Space>
    </Card>
  );
};

export default CheckMailCard;
