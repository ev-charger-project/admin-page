import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, ButtonProps, Popconfirm, PopconfirmProps } from "antd";
import { BaseButtonProps } from "antd/es/button/button";

interface DeleteRowButtonProps extends BaseButtonProps {
    buttonProps?: ButtonProps;
    popConfirmProps: PopconfirmProps;
}

const DeleteRowButton: React.FC<DeleteRowButtonProps> = ({ children, buttonProps, popConfirmProps }) => {
    return (
        <Popconfirm okText="Yes" cancelText="No" {...popConfirmProps}>
            <Button
                size="small"
                style={{
                    display: "flex",
                    alignItems: "center"
                }}
                danger
                type="link"
                {...buttonProps}>
                {children || (
                    <DeleteOutlined
                        style={{
                            fontSize: "20px"
                        }}
                    />
                )}
            </Button>
        </Popconfirm>
    );
};

export default DeleteRowButton;
