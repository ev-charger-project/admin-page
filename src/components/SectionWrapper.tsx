import React, { FC, ReactNode } from "react";
import { Flex, Spin, Typography } from "antd";

import { themeConstants } from "@/constant/theme";
import { c } from "@/utils/string";
import { PageMode } from "@/interfaces/router";
import EditButtonGroup from "@/components/button/EditButtonGroup";

type Props = {
    children: ReactNode;
    sectionLabel?: string;
    mode?: PageMode;
    onClickEdit?: () => void;
    onClose?: () => void;
    onSubmit?: () => void;
    loading?: boolean;
    width?: string | number;
    border?: boolean;
};

const SectionWrapper: FC<Props> = ({
    children,
    sectionLabel = "",
    mode,
    onClose,
    onClickEdit,
    onSubmit,
    loading = false,
    width = "1408px",
    border = true
}) => {
    return (
        <Spin spinning={loading}>
            <Flex
                vertical
                style={{
                    padding: border ? "40px" : "0",
                    borderRadius: "16px",
                    backgroundColor: "white",
                    width: width,
                    border: border ? "1px solid rgba(38, 62, 86, 0.1)" : "none",
                    position: "relative"
                }}>
                <Flex justify={sectionLabel ? "space-between" : "flex-end"}>
                    {sectionLabel && (
                        <Typography
                            style={{
                                marginTop: "0px",
                                marginBottom: "32px",
                                fontSize: 20,
                                fontWeight: 700,
                                fontStyle: "normal",
                                color: themeConstants.titleDefault,
                                lineHeight: "28px"
                            }}>
                            {c(sectionLabel)}
                        </Typography>
                    )}
                    <EditButtonGroup
                        mode={mode}
                        onClickEdit={onClickEdit}
                        onClose={onClose}
                        onSubmit={onSubmit}
                        style={{
                            position: "absolute",
                            top: border ? 20 : 0,
                            right: border ? 20 : 0,
                            zIndex: 999
                        }}
                    />
                </Flex>
                {children}
            </Flex>
        </Spin>
    );
};

export default SectionWrapper;
