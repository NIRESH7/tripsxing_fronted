import React from "react";
import { Tabs, Card } from "antd";

interface TabObject {
    label: string;
    key: string;
    content: React.ReactNode;
}

interface TabComponentProps {
    tabs: TabObject[];
    style?: React.CSSProperties;
    activeTabKey: string;
    onTabChange: (key: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs, style, activeTabKey, onTabChange }) => {
    return (
        <Card>
            <Tabs
                defaultActiveKey={activeTabKey}
                // activeKey={activeTabKey}
                size="large"
                style={{ marginBottom: 32, ...style }}
                onChange={onTabChange}
                items={tabs.map((tab) => ({ key: tab.key, label: tab.label, children: tab.content }))}
            // tabBarStyle={{
            //     fontFamily: "Inter, sans-serif",
            // }}
            >
                {/* {tabs.map((tab) => (
                    <TabPane tab={tab.label} key={tab.key}>
                        {tab.content}
                    </TabPane>
                ))} */}
            </Tabs>
        </Card>
    );
};

export default TabComponent;
