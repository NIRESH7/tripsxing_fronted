// ... (previous imports)

import { Button, Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { ArrowsAltOutlined, ShrinkOutlined } from "@ant-design/icons";
import { getWidgetStyle } from "../utils/utils";

interface FormLayoutProps {
  title: string;
  children?: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ title, children }) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const handleMaxMin = () => {
    setIsMaximized(!isMaximized);
  };

  // const plainOptions = ["Apple", "Pear", "Orange"];

  return (
    <>
      <div style={getWidgetStyle(isMaximized)}>
        {/* Render the toolbar above the grid */}
        <div
          style={{
            position: "relative",
            // height: isMaximized ? "100vh" : "100vh",
            padding: "0.5rem",
            backgroundColor: "white",
            justifyContent: "space-between",
            borderRadius: "16px",
          }}
        >
          <div>
            <Flex justify="center" align="center">
              <Title
                level={4}
                style={{
                  color: "#243271",
                  fontWeight: "bold",
                  margin: "0.5rem 0",
                  fontFamily: "verdana",
                }}
              >
                {title}
              </Title>

              <div style={{ position: "absolute", top: 0, right: 0 }}>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#243271",
                    marginRight: "0.5rem",
                  }}
                  icon={
                    isMaximized ? <ShrinkOutlined /> : <ArrowsAltOutlined />
                  }
                  onClick={handleMaxMin}
                />
              </div>
            </Flex>
            <Divider
              style={{
                backgroundColor: "#243271",
                margin: "0.5rem 0",
              }}
            />
          </div>
          {/* Maximize and Minimize buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "10px 5px",
            }}
          >
            {/* <Button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#243271",
                marginRight: "0.5rem",
              }}
              icon={<ShrinkOutlined />}
              onClick={handleMaxMin}
            /> */}
          </div>
          {children}
        </div>

        <div></div>
      </div>
    </>
  );
};

export default FormLayout;
