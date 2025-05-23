import { FC } from "react";
import { Tabs, TabsProps } from "antd";
import styled from "styled-components";
import React from "react";

import { themeConstants } from "@/constant/theme";

const StyledTab = styled(Tabs)`
    .ant-tabs-nav:before,
    .ant-tabs-ink-bar {
        display: none;
    }

    .ant-tabs-nav-list {
        gap: 36px;
    }

    .ant-tabs-tab {
        padding: 8px 16px !important;
        margin: 0 !important;
        border: 1px solid var(--border-color, #d0d5dd) !important;
        border-radius: 4px;
    }

    .ant-tabs-tab-btn {
        font-size: 12px;
        line-height: 16px;
        color: #98a2b3;
        font-weight: 500;
    }

    .ant-tabs-tab:not(:nth-last-child(2)):after {
        content: "";
        display: block;
        width: 28px;
        height: 2px;
        background-color: var(--border-color, #d0d5dd);
        position: absolute;
        top: calc(50% - 2px);
        left: calc(100% + 4px);
    }

    .ant-tabs-tab.ant-tabs-tab-active {
        border-color: var(--tab-active-bg, #06417c);
        background-color: var(--tab-active-bg, #06417c);

        .ant-tabs-tab-btn {
            color: var(--tab-active-text, #fff);
        }
    }
`;

const SectionTab: FC<TabsProps> = ({ items, style = {}, ...rest }) => {
    const tabStyle = {
        "--border-color": themeConstants.borderDefault,
        "--tab-active-bg": themeConstants.tabDefault,
        "--tab-active-text": themeConstants.tabActiveText
    };
    return <StyledTab {...rest} items={items} style={{ ...style, ...tabStyle }} />;
};

export default SectionTab;
