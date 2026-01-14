import React, { Dispatch, SetStateAction } from "react";
import { Avatar, Dropdown } from "antd";
import {
  //   SearchOutlined,
  //   QuestionOutlined,
  //   MailFilled,
  CaretDownFilled,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Logo from "../../../assets/logo/tripsxing_logo_transparent.png";
import { constant } from "../../../constants/constants";
import { UserData } from "../../../interfaces/interfaces";
import { route } from "../../../routes/routes";
import { useCurrentUserData, useStateZohoButton } from "../../../utils/state";
import Notification from "../Toast/Toast";
import {
  DropdownOverlay,
  LogoContainer,
  LogoImage,
  MenuContainer,
  MenuStyled,
  ProfileDropdownContainer,
  StyledLink,
  StyledNavbar,
} from "./NavBarStyles";
import { menuRouteHelperFunction } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { random } from "lodash";

const Navbar: React.FC<{
  // navbarItems: NavbarItem[],
  // menuItems: MenuItems[],
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ setDrawerOpen }) => {
  // type profileItem = {
  //     label: string;
  //     key: number | string;
  //     onClick: () => void;
  // }
  const items = [
    {
      label: "Profile",
      key: 1,
      onClick: () => {
        console.log("Profile Clicked");
      },
    },
    {
      label: "Settings",
      key: 2,
      onClick: () => {
        console.log("Settings Clicked");
      },
    },
    {
      label: "Help",
      key: 3,
      onClick: () => {
        console.log("Help Clicked");
      },
    },
  ];

  const { CurrentUserData } = useCurrentUserData() as {
    CurrentUserData: UserData;
  };

  const handleLogout = () => {
    localStorage.removeItem("TripxingToken");
    localStorage.removeItem("TripxingUserData");
    useStateZohoButton.setState({ TripxingUserData: null });
    Notification({
      message: "Success",
      description: "You have been successfully logged out",
      position: "bottom",
      style: { color: "green" },
      duration: 3,
    });
  };

  const navigate = useNavigate();

  return (
    <>
      {/* <Badge dot>

                    <Button shape="circle" icon={<BellOutlined />} style={{ border: 0 }} />
                </Badge> */}

      <div className="max-md:hidden">
        <StyledNavbar>
          <LogoContainer
            onClick={(event) => {
              // open a new tab with the link
              if (event.button === 1 || (event.ctrlKey && event.button === 0)) {
                // Middle click or Ctrl + Left click
                navigate("/");
              } else {
                navigate("/");
              }
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {/* <img src={ellipse} alt="Logo" /> */}
            <LogoImage
              src={Logo}
              alt="Logo"
              className="w-32 h-10 
                            flex-shrink-0 object-contain"
            />
          </LogoContainer>
          <MenuContainer>
            <div className="max-md:hidden">
              <MenuStyled
                id="navbar-menu"
                mode="horizontal"
                items={
                  // convertApiDataToMenuItems(NavbarItems!)
                  []
                }
                disabledOverflow={true}
                onClick={(e) => {
                  const keyString = e.key.toString();
                  navigate(
                    `/${menuRouteHelperFunction(
                      keyString.substring(2, keyString.length),
                      keyString
                    )}`
                  );
                  localStorage.setItem(
                    "currentMenuItemSelected",
                    keyString.substring(2, keyString.length)
                  );
                }}
              />
            </div>
            <ProfileDropdownContainer>
              <Dropdown
                dropdownRender={() => (
                  <DropdownOverlay>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {CurrentUserData.name ? CurrentUserData.name : "User"}
                    </div>
                    <div>
                      {CurrentUserData.email
                        ? ` (${CurrentUserData.email})`
                        : ""}
                    </div>
                    <div
                      style={{
                        background: "#CACACA",
                        height: "1px",
                        margin: "4px 0",
                      }}
                    />
                    <div
                      style={{
                        background: "#CACACA",
                        height: "1px",
                        margin: "4px 0",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // fontWeight: 'bold',
                      }}
                    >
                      <StyledLink
                        to={route.frontend.login}
                        onClick={handleLogout}
                      >
                        Log Off (ctrl + O)
                      </StyledLink>
                    </div>
                  </DropdownOverlay>
                )}
                arrow={true}
                autoAdjustOverflow={true}
                destroyPopupOnHide={true}
                trigger={["click"]}
                overlayStyle={{
                  background: "#FFFFFF",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                }}
                overlayClassName="overlay-menu"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: constant.pinkColor as string,
                      }}
                    >
                      {CurrentUserData.name ? (
                        CurrentUserData.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                      ) : (
                        <UserOutlined />
                      )}
                    </Avatar>
                    <CaretDownFilled
                      style={{ color: "white", fontSize: "16px" }}
                    />
                  </div>
                </a>
              </Dropdown>
            </ProfileDropdownContainer>
          </MenuContainer>
        </StyledNavbar>
      </div>
      <div className="hidden max-md:block">
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "0.5rem 1.25rem",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(36, 50, 113, 1)",
            position: "fixed",
            top: 0,
          }}
        >
          <MenuOutlined
            style={{ color: "white", fontSize: "20px" }}
            onClick={() => {
              setDrawerOpen(true);
            }}
          />

          <MenuContainer>
            <ProfileDropdownContainer>
              <Dropdown
                dropdownRender={() => (
                  <DropdownOverlay>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {CurrentUserData.name ? CurrentUserData.name : "User"}
                    </div>
                    <div className={"text-center"}>
                      {
                        JSON.parse(
                          localStorage.getItem("TripxingUserData") ?? ""
                        ).type
                      }
                    </div>
                    <div
                      style={{
                        background: "#CACACA",
                        height: "1px",
                        margin: "4px 0",
                      }}
                    />
                    {items!.map(({ key, label, onClick }) => (
                      <div
                        key={key}
                        style={{
                          textAlign: "center",
                          padding: "0.2rem",
                          cursor: "pointer",
                        }}
                        onClick={onClick}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#F0F0F0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "")
                        }
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderRadius = "0.3rem")
                        }
                      >
                        {label}
                      </div>
                    ))}
                    <div
                      style={{
                        background: "#CACACA",
                        height: "1px",
                        margin: "4px 0",
                      }}
                    />
                    <div>
                      <StyledLink
                        to={route.frontend.login}
                        onClick={handleLogout}
                      >
                        Log Off (ctrl + O)
                      </StyledLink>
                    </div>
                  </DropdownOverlay>
                )}
                arrow={true}
                autoAdjustOverflow={true}
                destroyPopupOnHide={true}
                trigger={["click"]}
                overlayStyle={{
                  background: "#FFFFFF",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                }}
                overlayClassName="overlay-menu"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Avatar
                      style={{
                        backgroundColor: constant.pinkColor as string,
                      }}
                    >
                      {CurrentUserData.name ? (
                        CurrentUserData.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                      ) : (
                        <UserOutlined />
                      )}
                    </Avatar>
                    <CaretDownFilled
                      style={{ color: "white", fontSize: "16px" }}
                    />
                  </div>
                </a>
              </Dropdown>
            </ProfileDropdownContainer>
          </MenuContainer>
        </div>
      </div>
    </>
  );
};

export default Navbar;
