import Dropdown from "antd/es/dropdown";
// import Button from "./Button";
import { Button } from "antd";
import { MenuProps } from "antd/es/menu/menu";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";

interface DropdownProps {
    DropDownProps: MenuP;
    DropDownName: string;
    styleProps?: React.CSSProperties;
}

interface MenuP {
    items: MenuProps['items'];
    onClick: MenuProps['onClick']
}



const DropDown: React.FC<DropdownProps> = ({ DropDownProps, DropDownName, styleProps }) => {
    // console.log(DropDownProps)
    // console.log(DropDownName)
    return (
        <Dropdown
            menu={DropDownProps}
            trigger={['click']}
        >
            <Button style={styleProps}>
                {/* <div> */}
                {DropDownName}
                <DownOutlined />
                {/* </div> */}
            </Button>
        </Dropdown>
    );
}

export default DropDown;


