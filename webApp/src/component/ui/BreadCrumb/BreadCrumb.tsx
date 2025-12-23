import { Breadcrumb } from "antd";
import React from "react";
import { useLocation, Link } from "react-router-dom";

const BreadCrumbComponent: React.FC<{ sideBarCollapsed: boolean }> = () => {
    const location = useLocation();
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div
            className={`px-1 py-1 bg-white w-full mt-16  transition-all duration-300 ease-in-in pl-6 flex items-center`}
        >
            <Breadcrumb
            >
                {pathnames.length > 0 ? (
                    <Breadcrumb.Item key={Math.random()}>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item >
                ) : (
                    <Breadcrumb.Item key={Math.random()}>Home</Breadcrumb.Item>
                )}
                {
                    pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathnames.length - 1;
                        return (
                            <Breadcrumb.Item key={index}>
                                {isLast ? (
                                    capatilize(name)
                                ) : (
                                    <Link to={routeTo}>{capatilize(name)}</Link>
                                )}
                            </Breadcrumb.Item>
                        );
                    })
                }
            </Breadcrumb >
        </div >
    );
};

export default BreadCrumbComponent;