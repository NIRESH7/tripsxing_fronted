import React, { Dispatch, SetStateAction } from "react";
import { Button, Drawer, Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserSwitchOutlined,
  ShopOutlined,
  GlobalOutlined,
  FormOutlined,
  SnippetsOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Airplay, Bath, FileClock, FileSearch, Film, Home, UsersRound } from "lucide-react";
import couponicon from "@/assets/icons/Coupon-icon.png";

const { Sider } = Layout;

type SidebarProps = {
  setSideBarCollapsed: Dispatch<SetStateAction<boolean>>;
  drawerOpen: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({
  setSideBarCollapsed,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setSideBarCollapsed(!collapsed);
  };

  const handleMenuClick = (e: { key: string }) => {
    navigate(`/${e.key}`);
    localStorage.setItem("currentMenuItemSelected", e.key);
  };

  const menuItems = [
    {
      label: "Dashboard",
      key: "dashboard",
      icon: <Home
        className="w-4 h-4"
      />,
    },
    {
      label: "Stay",
      key: "stay",
      icon: <ShopOutlined />,
    },
    { label: "Location", key: "location", icon: <GlobalOutlined /> },
    { label: "Blogs", key: "blogs", icon: <FormOutlined /> },
    { label: "Plans", key: "plans", icon: <SnippetsOutlined /> },
    {
      label: "Amenities",
      key: "amenities",
      icon: <Bath className="w-4 h-4" />,
    },
    {
      label: "User Management",
      key: "user-management",
      icon: <UserSwitchOutlined />,
    },
    {
      label: "Audit Log",
      key: "audit-log",
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      label: "Subscription Audit Log",
      key: "subscription-audit-log",
      icon: <ShoppingCartOutlined />,
    },
    { label: "Reels", key: "reels", icon: <Film className="w-4 h-4" /> },
    {
      label: "Coupon",
      key: "coupoun",
      icon: <img src={couponicon} alt="couponicon" className="w-4 h-4" />,
    },
    {
      label: "Media",
      key: "landing-page-ad-media",
      icon: <Airplay
        className="w-4 h-4"
      />,
    },
    // UserStayHistory
    {
      label: "User Stay History",
      key: "user-stay-history",
      icon: <UsersRound
        className="w-4 h-4"
      />,
    },
    // UserCouponHistory
    {
      label: "User Coupon History",
      key: "user-coupon-history",
      icon: <FileClock
        className="w-4 h-4"
      />,
    }
  ];

  const onClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="max-sm:hidden">
        <Sider
          collapsible
          collapsed={collapsed}
          theme="light"
          // style={{ width: '20%', position: 'fixed', top: '4rem', bottom: 0 }}
          onCollapse={toggleCollapsed}
          className="h-full mt-16"
        >
          <Button
            onClick={toggleCollapsed}
            style={{ width: "100%", borderRadius: "0px" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu
            defaultSelectedKeys={[
              localStorage.getItem("currentMenuItemSelected") || "stay",
            ]}
            mode="inline"
            theme="light"
            onClick={handleMenuClick}
          >
            {menuItems.map((item) => {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
      </div>
      <Drawer
        title="Sidebar"
        placement="left"
        onClose={onClose}
        open={drawerOpen}
        width="80%"
      >
        <Menu
          defaultSelectedKeys={[
            localStorage.getItem("currentMenuItemSelected") || "stay",
          ]}
          mode="inline"
          theme="light"
          onClick={handleMenuClick}
        >
          {menuItems.map((item) => {
            return (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Drawer>
    </>
  );
};

export default Sidebar;
