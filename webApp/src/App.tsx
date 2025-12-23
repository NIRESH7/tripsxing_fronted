import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Spin } from "antd";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from "react";
import AuditLog from "./pages/AuditLog";
import SubscriptionAuditLog from "./pages/SubscriptionAuditLog";
import { queryClient } from "./hooks/Hooks";
import LandingPageAdMedia from "./pages/LandingPageAdMedia";
import Dashboard from "./pages/dashboard";
import UserStayHistory from "./pages/UserStayHistory";
import UserCouponHistory from "./pages/UserCouponHistory";

// Lazy-loaded components
const AuthLayout = lazy(() => import("./layout/AuthLayout"));
const BaseLayout = lazy(() => import("./layout/BaseLayout"));
const ErrorPage = lazy(() => import("./component/ErrorCard"));
// const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/login"));
const ForgetPassword = lazy(() => import("./pages/forgetPassword"));
const CreatePassword = lazy(() => import("./pages/createPassword"));
const AuthPage = lazy(() => import("./component/AuthPageCard"));
// const MainScreenLayout = lazy(() => import("./layout/MainScreenLayout"));
const StayPage = lazy(() => import("./pages/Stays/Stay"));
const Blog = lazy(() => import("./pages/Blog"));
const Amenities = lazy(() => import("./pages/Amenities"));
const Plans = lazy(() => import("./pages/Plans"));
const Users = lazy(() => import("./pages/Users"));
const Location = lazy(() => import("./pages/Location"));
const Reel = lazy(() => import("./pages/reels"));
const Coupoun = lazy(() => import("./pages/Coupoun"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Inter, sans-serif  !important",
          },
          components: {
            Select: {
              optionSelectedBg: "#E6F4FF",
              optionActiveBg: "#E6F4FF",
            },
            Tabs: {
              inkBarColor: "#243271",
              itemActiveColor: "#243271",
              itemSelectedColor: "#243271",
            },
          },
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Spin size="large" />
            </div>
          }
        >
          <Router>
            <Routes>
              <Route element={<BaseLayout />}>
                <Route index element={<>
                  {
                    window.location.pathname === "/" ? <LandingPageAdMedia /> : null
                  }
                </>} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="landing-page-ad-media" element={<LandingPageAdMedia />} />
                <Route path="stay" element={<StayPage />} />
                <Route path="location" element={<Location />} />
                <Route path="blogs" element={<Blog />} />
                <Route path="amenities" element={<Amenities />} />
                <Route path="plans" element={<Plans />} />
                <Route path="user-management" element={<Users />} />
                <Route path="audit-log" element={<AuditLog />} />
                <Route path="reels" element={<Reel />} />
                <Route path="coupoun" element={<Coupoun />} />
                <Route path="subscription-audit-log" element={<SubscriptionAuditLog />} />
                <Route
                  path="user-stay-history"
                  element={<UserStayHistory />}
                />
                <Route
                  path="user-coupon-history"
                  element={<UserCouponHistory />}
                />
              </Route>

              <Route path="auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="forgetpassword" element={<ForgetPassword />} />
                <Route path="resetpassword" element={<CreatePassword />} />
                <Route path="authpage" element={<AuthPage />} />
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Router>
        </Suspense>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
