import React, { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
const Navbar = React.lazy(() => import('../component/ui/Navbar/NavBar'));
const BreadCrumbComponent = React.lazy(() => import('../component/ui/BreadCrumb/BreadCrumb'));
import { Layout, Spin } from 'antd';
const Sidebar = React.lazy(() => import('../component/ui/Siderbar/Sidebar'));
import { User, UserData, } from '../interfaces/interfaces';
import { useCurrentUserData } from '../utils/state';
import { route } from '../routes/routes';
import Notification from '../component/ui/Toast/Toast';

const BaseLayout: React.FC = () => {
  // const navigate = useNavigate();
  const TripxingToken = localStorage.getItem('TripxingToken');

  const [sideBarCollapsed, setSideBarCollapsed] = React.useState(false);
  const { setCurrentUserData } = useCurrentUserData() as {
    CurrentUserData: User,
    UserID: number,
    setUserID: (value: number) => void,
    setCurrentUserData: (value: UserData) => void
  };
  useEffect(() => {
    const TripxingUserData = localStorage.getItem('TripxingUserData');
    if (TripxingUserData) {
      setCurrentUserData(JSON.parse(TripxingUserData));
    }
  }, [setCurrentUserData]);

  const AuthCheck: React.FC = () => {
    alert('Login Unsuccessful');
    <Notification message="Error" description="Login Unsuccessful" position="bottom" />
    window.location.href = route.frontend.login
    return null;
  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {TripxingToken ? <Layout style={{
        // minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
        <Suspense fallback={<Spin />}>
          <Navbar setDrawerOpen={setDrawerOpen} />
        </Suspense>
        <Layout>
          <Suspense fallback={<Spin />}>
            <Sidebar
              setSideBarCollapsed={setSideBarCollapsed}
              setDrawerOpen={setDrawerOpen}
              drawerOpen={drawerOpen}
            />
          </Suspense>
          <Layout>
            <Suspense fallback={<Spin />}>
              <BreadCrumbComponent sideBarCollapsed={sideBarCollapsed} />
              <div className={`top-24 flex-grow w-full  mb-12 overflow-auto transition-all duration-300 ease-in-out`}>
                <Outlet />
              </div>
            </Suspense>
          </Layout>
        </Layout>
      </Layout > :
        <AuthCheck />
      }
    </>
  );
};

export default BaseLayout;
