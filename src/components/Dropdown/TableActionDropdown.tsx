import React, { MouseEventHandler } from "react";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, ButtonProps, Dropdown, Flex, PopconfirmProps } from "antd";
import { BaseButtonProps } from "antd/es/button/button";

import { c } from "@/utils/string";
import { ItemType } from "antd/es/menu/interface";

interface TableActionDropdownProps {
    onClickEdit?: MouseEventHandler<HTMLElement>;
    onClickDuplicate?: MouseEventHandler<HTMLElement>;
    onClickDelete?: (e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
    deleteItem?: string;
}

const TableActionDropdown: React.FC<TableActionDropdownProps> = ({ onClickEdit, onClickDelete, onClickDuplicate }) => {
    const menuItems: ItemType[] = [];

    if (onClickEdit) {
        menuItems.push({
            key: "1",
            label: <ActionEditTableRowButton onClick={onClickEdit}>{c("Edit")}</ActionEditTableRowButton>
        });
    }

    if (onClickDuplicate) {
        menuItems.push({
            key: "2",
            label: <ActionEditTableRowButton onClick={onClickDuplicate}>{c("Duplicate")}</ActionEditTableRowButton>
        });
    }

    if (onClickDelete) {
        menuItems.push({
            key: "3",
            label: (
                <ActionDeleteTableRowButton
                    buttonProps={{
                        onClick: onClickDelete
                    }}>
                    {c("Delete")}
                </ActionDeleteTableRowButton>
            )
        });
    }
    return (
        <Dropdown
            menu={{
                items: menuItems
            }}
            onOpenChange={() => {}}>
            <MoreOutlined
                style={{
                    fontSize: "24px"
                }}
            />
        </Dropdown>
    );
};

export default TableActionDropdown;

const ActionEditTableRowButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button type="link" size="small" {...props}>
            {(
                <Flex gap={4}>
                    <EditOutlined
                        style={{
                            fontSize: "16px"
                        }}
                    />
                    {props?.children}
                </Flex>
            ) ?? <EditOutlined style={{ fontSize: 24 }} />}
        </Button>
    );
};

interface ActionDeleteTableRowButtonProps extends BaseButtonProps {
    buttonProps?: ButtonProps;
    popConfirmProps?: PopconfirmProps;
}

const ActionDeleteTableRowButton: React.FC<ActionDeleteTableRowButtonProps> = ({ children, buttonProps }) => {
    return (
        //<Popconfirm okText="Yes" cancelText="No" {...popConfirmProps}>
        <Button
            size="small"
            style={{
                display: "flex",
                alignItems: "center"
            }}
            danger
            type="link"
            {...buttonProps}>
            {(
                <Flex gap={4}>
                    <DeleteOutlined
                        style={{
                            fontSize: "16px"
                        }}
                    />
                    {children}
                </Flex>
            ) || (
                <DeleteOutlined
                    style={{
                        fontSize: "20px"
                    }}
                />
            )}
        </Button>
        //</Popconfirm>
    );
};
