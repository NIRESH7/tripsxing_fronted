
import React, { CSSProperties } from 'react';
import { constant } from '../../../constants/constants';
import plusIcon from '../../../assets/icons/plus-1.svg';
import editIcon from "../../../assets/icons/edit-1.svg";
import deleteIcon from '../../../assets/icons/delete-button-1.svg'
import returnIcon from '../../../assets/icons/undo-1.svg'
import saveIcon from '../../../assets/icons/diskette-1.svg'
import telegramIcon from '../../../assets/icons/send.svg'
import verifiedIcon from '../../../assets/icons/verified.svg';
import loadingIcon from '../../../assets/icons/loading-1.svg';
import versionIcon from "../../../assets/icons/version-1.svg";
import showRecordIcon from "../../../assets/icons/visual-1.svg";
import HideRecordIcons from "../../../assets/icons/eye-1.svg";
import ExportIcon from "../../../assets/icons/export-1.svg"
import ImportParameterIcon from "../../../assets/icons/import-parameter-lists.svg";
import Unapproved from "../../../assets/icons/failure-1.svg";
import zohoPeopleIcon from "../../../assets/icons/zohoPeopleIcon-removebg-preview.png";
import { ButtonProps } from '../../../interfaces/interfaces';
import { Button } from 'antd';
import accessIcon from "../../../assets/icons/access-icon.svg";
import manageRoleIcon from "../../../assets/icons/manageRole-icon.svg";
import upArrowIcon from "../../../assets/icons/upArrowIcon.svg";
import downArrowIcon from "../../../assets/icons/downArrowIcon.svg";
import Upload from "../../../assets/icons/Upload.svg";
import Download from "../../../assets/icons/Download.svg";

const Buttons: React.FC<ButtonProps> = ({ onClick, text, size, backgroundColor, variant, style, loading, icon }) => {

    // create style for button here
    const authButtonStyle: CSSProperties = {
        width: size === "small" ? "5rem" : size === "medium" ? "10rem" : "20rem",
        height: "3rem",
        padding: "0.75rem 0rem",
        borderRadius: "0.75rem",
        backgroundColor: backgroundColor ? backgroundColor : constant.primaryColor as string,
        color: "#fff",
        fontSize: "1rem",
        fontWeight: 700,
        fontFamily: "verdana",
        fontStyle: "normal",
        lineHeight: "normal",
        border: "none",
        cursor: "pointer",
        ...style
    };

    const tableButtonStyle: CSSProperties = {
        display: "flex",
        padding: '1.25rem 0.5rem',
        alignItems: "center",
        gap: "0.25rem",
        borderRadius: "0.25rem",
        // width: size === "small" ? "5rem" : size === "medium" ? "10rem" : "20rem",
        border: "1px solid #000",
        background: "#fff",

        color: "#000",
        textAlign: "center",
        fontFamily: "verdana",
        fontSize: "0.875rem",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        cursor: "pointer",
        ...style
    };

    const modalButtonStyle: CSSProperties = {
        width: size === "small" ? "5rem" : size === "medium" ? "10rem" : "20rem",
        height: "3rem",
        padding: "0.75rem 0rem",
        borderRadius: "0.75rem",
        backgroundColor: backgroundColor ? backgroundColor : constant.primaryColor as string,
        color: "#fff",
        fontSize: "1rem",
        fontWeight: 700,
        fontFamily: "verdana",
        fontStyle: "normal",
        lineHeight: "normal",
        border: "none",
        cursor: "pointer",
        ...style
    };





    const iconAssign = (icon: string) => {
        switch (icon) {
            case "Add":
                return <img src={plusIcon} alt='plus-icon' />; // 'fas fa-plus
            case "Edit":
                return <img src={editIcon} alt='edit-icon' />;
            case "Show":
                return <i className="fas fa-eye"></i>;
            case "Remove":
                return <img src={deleteIcon} alt='remove-icon' />;
            case "Return":
                return <img src={returnIcon} alt='return-icon' />;
            case "Add Another":
                return <img src={plusIcon} alt='plus-icon' />;
            case "Save":
                return <img src={saveIcon} alt='save-icon' />;
            case "Send For Approval":
                return <img src={telegramIcon} alt='send-icon' />;
            case "Approve Version":
                return <img src={verifiedIcon} alt='verified-icon' />;
            case "Reset Approvals":
                return <img src={loadingIcon} alt='loading-icon' />;
            case "New Version":
                return <img src={versionIcon} alt='new-version-icon' />;
            case "Prev":
                return <i className="fas fa-arrow-left"></i>;
            case "Next":
                return <i className="fas fa-arrow-right"></i>;
            case "Show Records ":
                return <img src={showRecordIcon} alt='showRecord-icon' />;
            case "Show Notes":
                return <img src={showRecordIcon} alt='showNotes-icon' />;
            case "Hide Records":
                return <img src={HideRecordIcons} alt='HideRecord-icon' />;
            case "Export":
                return <img src={ExportIcon} alt='Export-icon' />;
            case "Import Parameter Lists":
                return <img src={ImportParameterIcon} alt='Import-Parameter-Lists-icon' />;
            case "Unapproved":
                return <img src={Unapproved} alt='Unapproved-icon' />;
            case "Zoho List":
                return <img src={zohoPeopleIcon} alt='Zoho-List-icon' style={{ width: "24px", height: '24px' }} />;

            case "Access":
                return <img src={accessIcon} alt='Access-icon' />;
            case "Manage Role":
                return <img src={manageRoleIcon} alt='Manage-Role-icon' />;
            case "Up Arrow":
                return <img src={upArrowIcon} alt='Up-Arrow-icon' />;
            case "Down Arrow":
                return <img src={downArrowIcon} alt='Down-Arrow-icon' />;
            case "Upload":
                return <img src={Upload} alt='Upload' />;
            case "Download":
                return <img src={Download} alt='Download' />;


            // case "Up-Arrow":
            //     return <UpCircleFilled style={{
            //         // background: "#243271"
            //     }} />
            // case "Down-Arrow":
            //     return <DownCircleFilled style={{
            //         // background: "#243271"
            //     }} />
            default:
                return <i className="fas fa-plus"></i>;
        }
    }


    switch (variant) {
        case "auth":
            return (
                <Button
                    type="primary"
                    // icon={<PoweroffOutlined />}
                    loading={loading}
                    onClick={onClick}
                    style={authButtonStyle}
                >
                    {text}
                </ Button>
                // <button onClick={onClick} style={authButtonStyle}>
                //     {text}
                // </button>
            );
        case "table":
            return (
                <>
                    {/* {iconAssign(text)} */}
                    <Button
                        type="primary"
                        icon={
                            // iconAssign(text)
                            icon ?? iconAssign(text as string)
                        }
                        loading={loading}
                        onClick={onClick}
                        style={tableButtonStyle}
                    >
                        {text}
                    </ Button>
                </>

                // <div>
                //     <button onClick={onClick} style={tableButtonStyle}>
                //         {iconAssign(text)}
                //         {text}
                //     </button>
                // </div>
            );
        case "modal":
            return (
                <>
                    {/* {iconAssign(text)} */}
                    <Button
                        type="primary"
                        icon={
                            // iconAssign(text)
                            icon ?? iconAssign(text as string)
                        }
                        loading={loading}
                        onClick={onClick}
                        style={modalButtonStyle}
                    >
                        {text}
                    </ Button>
                </>
                // <button onClick={onClick} style={modalButtonStyle}>
                //     {text}
                // </button>
            );
        default:
            return (
                <Button
                    type="primary"
                    loading={loading}
                    onClick={onClick}
                    style={style}
                >
                    {text}
                </ Button>

                // <button onClick={onClick} style={style}>
                //     {text}
                // </button>
            );
    }

};

export default Buttons;
