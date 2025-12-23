import PasswordScreenLayout from "../layout/PasswordScreenLayout";
import { useState } from "react";
import { PostApiCustomerRoutes } from "../hooks/ApiCustomerHooks";
import Notification from "../component/ui/Toast/Toast";
import { useMediaQuery } from "react-responsive";
import PasswordResetCard from "../component/PasswordReset";
import CreatePasswordCard from "../component/CreatePasswordCard";
import { route } from "../routes/routes";
// import { useNavigate } from "react-router-dom";

const CreatePassword = () => {
  // const navigate = useNavigate();
  const isLaptop = useMediaQuery({ minWidth: 992 });
  const isDesktop = useMediaQuery({ minWidth: 1200 });
  const rectangleStyle = {
    width: isDesktop ? "40%" : isLaptop ? "20%" : "20%",
    height: isDesktop ? "40%" : isLaptop ? "20%" : "20%",
    scale: isDesktop ? "1.5" : isLaptop ? "1" : "1.5",
    left: isDesktop ? "-544px" : isLaptop ? "-336px" : "-544px",
    top: isDesktop ? "456px" : isLaptop ? "322px" : "456px",
    // other styles...
  };

  const [isResetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  const submitCreatePassword = (CreatePassword: object) => {
    console.log(CreatePassword);

    PostApiCustomerRoutes(route.backend.forgotPassword, {
      ...CreatePassword,
      token,
    })
      .then((res) => {
        console.log(res);

        // Fix: Check for statusCode === 200 instead of status === 0
        const isSuccess = res.statusCode === 200;
        const notificationMessage = isSuccess ? "Success" : "Error";
        const notificationDescription = isSuccess
          ? "Password reset successfully"
          : res.message || "An error occurred";

        Notification({
          message: notificationMessage,
          description: notificationDescription,
          position: "bottom",
          style: {},
          duration: isSuccess ? 3 : 5, // Show errors longer
        });

        // Update success state based on statusCode
        setResetPasswordSuccess(isSuccess);

        if (isSuccess) {
          setTimeout(() => {
            Notification({
              message: "Success",
              description: "Password reset successfully",
              position: "bottom",
              style: {},
              duration: 3,
            });
          }, 1500); // Give user time to see success message
        }
      })
      .catch((error) => {
        console.error("Password reset error:", error);

        Notification({
          message: "Error",
          description: "Failed to connect to the server. Please try again.",
          position: "bottom",
          style: {},
          duration: 5,
        });
      });
  };

  return (
    <PasswordScreenLayout
      rectangleStyle={rectangleStyle}
      RenderCard={() => (
        <>
          {isResetPasswordSuccess ? (
            <PasswordResetCard />
          ) : (
            <CreatePasswordCard submitCreatePassword={submitCreatePassword} />
          )}
        </>
      )}
    />
  );
};

export default CreatePassword;
