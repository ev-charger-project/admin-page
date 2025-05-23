"use client";

import React, { FC } from "react";
import { Layout } from "antd";

import SiderContent from "@/components/Sider";

const { Content, Header } = Layout;
const DashboardLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Layout
            style={{
                minHeight: "100vh",
                maxHeight: "fit-content"
            }}>
            <Header
                style={{
                    height: "fit-content",
                    width: "100%",
                    padding: "20px 10px 0px 10px"
                    //boxShadow: "0px 4px 40px -10px rgba(0, 0, 0, 0.06)"
                }}>
                <SiderContent />
            </Header>
            {/*<DashboardHeader />*/}
            <Content
                style={{
                    margin: "auto",
                    width: "70%"
                }}>
                {children}
                {/*<ReviewSVDeliverableModal />*/}
            </Content>
        </Layout>
    );
};

export default DashboardLayout;
