import React, { FC, ReactNode } from "react";
import { Button, ButtonProps, Dropdown, Flex } from "antd";

interface CustomDropdownProps {
    buttonProps?: ButtonProps;
    children: ReactNode;
    title: string | ReactNode;
    onOpenChange: (nextOpen: boolean, info: { source: "trigger" | "menu" }) => void;
    styles?: {
        backgroundColor: string;
        color: string;
    };
    open?: boolean;
}

const CustomDropdown: FC<CustomDropdownProps> = ({ buttonProps, children, title, onOpenChange, open }) => {
    return (
        <Dropdown
            placement="bottomLeft"
            trigger={["click"]}
            open={open}
            dropdownRender={() => (
                <Flex
                    style={{
                        width: "100%",
                        maxWidth: 464,
                        padding: "36px 24px",
                        backgroundColor: "#fff",
                        gap: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 14px 4px rgba(16, 24, 40, 0.1)",
                        height: "100%",
                        overflow: "auto",
                        border: "0.5px solid rgba(27, 97, 189, 0.2)"
                    }}
                    vertical>
                    {children}
                </Flex>
            )}
            onOpenChange={onOpenChange}>
            <Button
                {...buttonProps}
                style={{
                    width: "100%",
                    maxWidth: 220,
                    backgroundColor: "#fff",
                    color: "#1b61bd",
                    ...buttonProps?.style
                }}
                type="primary">
                {title}
            </Button>
        </Dropdown>
    );
};

export default CustomDropdown;
