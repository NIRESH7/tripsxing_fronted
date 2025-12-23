import React from 'react';
import { Outlet } from 'react-router-dom';


const AuthLayout: React.FC = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
        }}>
            <Outlet />
        </div>
    );
};

export default AuthLayout;
