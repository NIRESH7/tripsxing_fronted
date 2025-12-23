import React from "react";
import { Layout } from "antd";
// import Units from "../pages/TestMaster/units/Units";
// import Sidebar from '../component/Sidebar';

const { Content } = Layout;

const MainScreenLayout: React.FC = () => {
  return (
    <Layout>
      {/* <Sidebar styleProps={{ height: "30vh" }} /> */}
      <Content>
        {/* <ExportCommentsForm /> */}
        {/* <Units /> */}
      </Content>
    </Layout>
  );
};

export default MainScreenLayout;
