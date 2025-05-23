"use client";

import React, { FC, ReactNode, useMemo, useState } from "react";
import { DownOutlined, ExclamationCircleOutlined, LinkOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Typography } from "antd";

import CustomDropdown from "@/components/Dropdown/CustomDropdown";
import { c } from "@/utils/string";

interface DropdownButtonsProps {}

interface DropdownContentData {
    label: string;
    isVisible?: boolean;
    groups: DropdownContentItem[];
}

interface DropdownContentItem {
    label: string;
    isVisible?: boolean;
    icon: JSX.Element | ReactNode;
    onClick?: () => void;
}

const UtilityDropdownButtons: FC<DropdownButtonsProps> = () => {
    const [changeColorQuickLinks, setChangeColorQuickLinks] = useState(false);
    const [changeIconQuickLinks, setChangeIconQuickLinks] = useState(false);
    const [isQuickLinksOpen, setQuickLinksOpen] = useState(false);
    const handleOpenChange = (nextOpen: boolean, info: { source: "trigger" | "menu" }) => {
        if (info.source === "trigger" || nextOpen) {
            setQuickLinksOpen(nextOpen);
        }
        setChangeColorQuickLinks((prev) => !prev);
        setChangeIconQuickLinks((prev) => !prev);
    };
    const [changeColorIssueLoggings, setChangeColorIssueLoggings] = useState(false);
    const [changeIconIssueLoggings, setChangeIssueLoggings] = useState(false);
    const handleOpenChangeIssueLoggings = () => {
        setChangeColorIssueLoggings((prev) => !prev);
        setChangeIssueLoggings((prev) => !prev);
    };

    //const router = useRouter();

    // const shouldShowUtilButtons = useMemo(() => {
    //   return (
    //     router.checkCurrentPathMatch("work-order-detail") ||
    //     router.checkCurrentPathMatch("site-visit-detail")
    //   );
    // }, [router]);

    const issueLoggingContent = useMemo<DropdownContentData[]>(() => {
        return [];
    }, []);

    // if (!shouldShowUtilButtons) return null;

    const _renderDropdownData = ({ isVisible = true, ...quickLinkData }: DropdownContentData) => {
        return (
            isVisible && (
                <React.Fragment key={quickLinkData.label}>
                    <Typography
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#263e56"
                        }}>
                        {quickLinkData.label}
                    </Typography>
                    <Divider style={{ margin: 0 }} />
                    <Flex wrap="wrap" align="center" gap="24px">
                        {quickLinkData.groups.map(
                            ({ isVisible: isVisibleItem = true, ...i }) =>
                                isVisibleItem && (
                                    <Button
                                        style={{
                                            padding: "0 24px",
                                            backgroundColor: "rgba(27, 97, 189, 0.1)",
                                            gap: "6px",
                                            borderRadius: "8px",
                                            boxShadow: `0 4px 6px -2px rgba(16, 24, 40, 0.03),
                      0 12px 16px -4px rgba(16, 24, 40, 0.08)`,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "#1b61bd",
                                            border: "none"
                                        }}
                                        key={i.label}
                                        icon={i.icon}
                                        onClick={i.onClick ? i.onClick : () => {}}>
                                        {i.label}
                                    </Button>
                                )
                        )}
                    </Flex>
                </React.Fragment>
            )
        );
    };

    return (
        <Flex gap={40} justify="end">
            <CustomDropdown
                title={
                    <span style={{ fontSize: 12, fontWeight: 400 }}>
                        <ExclamationCircleOutlined style={{ marginRight: "8px" }} />
                        {c("Issues Logging")}{" "}
                        {changeIconIssueLoggings ? (
                            <DownOutlined style={{ marginLeft: "24px" }} />
                        ) : (
                            <RightOutlined style={{ marginLeft: "24px" }} />
                        )}
                    </span>
                }
                buttonProps={{
                    style: {
                        backgroundColor: changeColorIssueLoggings ? "#fff" : "#06417C",
                        color: changeColorIssueLoggings ? "#06417C" : "#fff",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        height: "32px",
                        alignItems: "center",
                        display: "flex"
                    }
                }}
                onOpenChange={handleOpenChangeIssueLoggings}>
                {issueLoggingContent.map((quickLinkData) => _renderDropdownData(quickLinkData))}
            </CustomDropdown>
            <CustomDropdown
                open={isQuickLinksOpen}
                title={
                    <span style={{ fontSize: 12, fontWeight: 400 }}>
                        <LinkOutlined style={{ marginRight: "8px" }} />
                        {c("Quick Links")}{" "}
                        {changeIconQuickLinks ? (
                            <DownOutlined style={{ marginLeft: "24px" }} />
                        ) : (
                            <RightOutlined style={{ marginLeft: "24px" }} />
                        )}
                    </span>
                }
                buttonProps={{
                    style: {
                        backgroundColor: changeColorQuickLinks ? "#fff" : "#06417C",
                        color: changeColorQuickLinks ? "#06417C" : "#fff",
                        borderRadius: "4px",
                        padding: "8px 16px",
                        height: "32px",
                        alignItems: "center",
                        display: "flex"
                    }
                }}
                onOpenChange={handleOpenChange}>
                {null}
            </CustomDropdown>
        </Flex>
    );
};

export default UtilityDropdownButtons;
