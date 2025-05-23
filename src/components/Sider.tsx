"use client";

import React, { FC, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Flex, Menu, MenuProps, Typography } from "antd";
import styled from "styled-components";

import { c } from "@/utils/string";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { useRouter } from "@/hook/router";
import Link from "next/link";
import SharedButton from "./button/SharedButton";
import { signOut } from "next-auth/react";
import { useActionModal } from "@/HOC/ConfirmModalWrapper";

type Props = { className?: string };

let SiderContent: FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();
    const handleClickMenuItem: MenuProps["onClick"] = (e) => {
        router.push(e.key);
    };

    const { showModal: showActionModal } = useActionModal();
    const items = useMemo<ItemType<MenuItemType>[]>(
        () => [
            // {
            //   key: router.paths.get("dashboard"),
            //   label: c("Dashboard"),
            //   icon: <AppstoreOutlined style={{ fontSize: 20 }} />,
            // },
            {
                key: router.paths.get("ev-chargers"),
                label: c("EV Charger")
            },
            {
                key: router.paths.get("locations"),
                label: c("Location")
            },
            {
                key: router.paths.get("power-plug-types"),
                label: c("Power Plug Types")
            },
            {
                key: router.paths.get("power-outputs"),
                label: c("Power Outputs")
            },
            {
                key: router.paths.get("users"),
                label: c("EV Users")
            },
            {
                key: router.paths.get("amenities"),
                label: c("Amenities")
            }
        ],
        [router.paths]
    );

    // TODO: edit logic when have finalized Sidebar
    const selectedKeys = useMemo(() => {
        const found = items.find((i) => i?.key?.toString() === pathname);
        if (found) {
            return [found.key?.toString() || ""];
        }

        return items
            .filter((i) => i?.key && i.key.toString() !== "/dashboard" && pathname.startsWith(i.key.toString()))
            .map((i) => i?.key?.toString() ?? "");
    }, [items, pathname]);
    return (
        <div
            className={className}
            style={{
                width: "100%"
            }}>
            <div
                style={{
                    width: "80%",
                    margin: "32px auto"
                }}>
                <Link
                    href={router.paths.get("dashboard")}
                    style={{
                        marginBottom: 50
                    }}>
                    <Flex align="flex-start" gap={12}>
                        <Typography.Title
                            level={1}
                            className="app-name"
                            style={{
                                color: "#34A853"
                            }}>
                            EV Chargers
                        </Typography.Title>
                        <span style={{ opacity: 0.3, fontSize: 12 }}>{process.env.NEXT_PUBLIC_VERSION}</span>
                    </Flex>
                </Link>
            </div>

            <Flex
                style={{
                    width: "70%",
                    margin: "0 auto"
                }}
                justify={"space-between"}>
                <Menu
                    mode="horizontal"
                    items={items}
                    onClick={handleClickMenuItem}
                    selectedKeys={selectedKeys}
                    style={{
                        border: "none",
                        fontWeight: 500,
                        backgroundColor: "inherit"
                    }}
                />
                <Flex gap={12} align="center">
                    <SharedButton
                        onClick={() => {
                            showActionModal({
                                content: `Are you sure you want to sign out?`,
                                onOk: () =>
                                    signOut({
                                        callbackUrl: "/"
                                    })
                            });
                        }}
                        title={"Sign out"}
                        customSize="lg"
                        customType={"action"}
                        customTextStyles={{
                            fontSize: 16,
                            lineHeight: "22px",
                            fontWeight: 500
                        }}
                    />
                </Flex>
            </Flex>
        </div>
    );
};

SiderContent = styled(SiderContent)`
    .ant-menu-item span {
        color: #000;
        font-size: 16px;
        font-weight: 500;
    }

    .ant-menu-item.ant-menu-item-selected {
        background-color: #34a853;

        span {
            font-size: 16px;
            font-weight: 700;
            color: #000;
        }
    }
  }

    .ant-menu-item {
        background-color: #c3e5cc;
        width: 167px;
        text-align: center;
    }

    .app-name {
        font-size: 24px;
        margin: 0;
        color: #1b61bd;
        font-weight: 600;
    }
`;

export default SiderContent;
