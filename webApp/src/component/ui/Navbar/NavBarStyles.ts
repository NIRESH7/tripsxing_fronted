import { Link } from "react-router-dom";
import styled from "styled-components";
import { Menu } from "antd";
const StyledNavbar = styled.div`
    display: flex;
    width: 100%;
    padding: 0.5rem 1.25rem;
    justify-content: space-between;
    align-items: center;
    background: rgba(36, 50, 113, 1);
    position: fixed;
    height: 4rem;
    top: 0;
    z-index: 100;
    
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const LogoImage = styled.img`
    /* width: 100%; */
    /* height: 100%; */
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 2rem;
`;

const ProfileDropdownContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 5px;
`;

const MenuStyled = styled(Menu)`
.ant-menu-submenu-title{
    color: white;
}
    color: white;
    /* font-family: verdana; */
    /* font-size: 0.75rem; */
    /* font-style: normal; */
    /* font-weight: 700; */
    background-color: #243271;

    .navbar-menu {
        & > .ant-menu-item {
            color: white;
            font-family: verdana;
            font-size: 0.75rem;
            font-style: normal;
            font-weight: 700;
            background-color: #243271;
        }
    }
`;

const StyledLink = styled(Link)`
    /* color: 'black'; */
    color: red;
    &:hover {
        background-color: 'grey';
    }
`;

const DropdownOverlay = styled.div`
    /* background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 0.5rem;
    padding: 0.5rem; */
`;

export {
    StyledNavbar,
    LogoContainer,
    LogoImage,
    MenuContainer,
    ProfileDropdownContainer,
    MenuStyled,
    StyledLink,
    DropdownOverlay,
};