import { Select } from "antd";
import React, { CSSProperties } from "react";
interface FooterMenuObject {
    label: string;
    value: string;
    style: CSSProperties;
}

interface FooterProps {
    footerMenu: { roleName: string }[];
    loading?: boolean;
    error?: Error
}

const Footer: React.FC<FooterProps> = ({ footerMenu, loading, error }) => {
    const options = footerMenu?.map<FooterMenuObject>((item) => {
        return {
            label: item.roleName,
            value: item.roleName,
            style: {
                color: "#000",
                textAlign: "center",
                fontFamily: "Verdana",
                fontSize: "0.825rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
            },
        };
    });

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                padding: "0.25rem 3.75rem",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "0.625rem",
                background: "#243271",
                position: 'fixed', bottom: 0
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        color: "#FFF",
                        textAlign: "center",
                        fontFamily: "Verdana",
                        fontSize: "0.825rem",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                >
                    User As:
                </div>
                <Select
                    defaultValue={
                        localStorage.getItem("userRole") ?? "Select User Role"
                    }
                    style={{
                        width: "12rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #000",
                        background: "#FFF",
                        color: "#000",
                        textAlign: "center",
                        fontFamily: "Verdana",
                        fontSize: "0.825rem",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                    // dropdownMatchSelectWidth={false}
                    popupMatchSelectWidth={false}
                    placement={"topRight"}
                    options={error ? [] : options}
                    loading={loading}
                />
                <div style={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Verdana",
                    fontSize: "0.825rem",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",

                }}>
                    Time Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
            </div>
        </div>
    );
};

export default Footer;
