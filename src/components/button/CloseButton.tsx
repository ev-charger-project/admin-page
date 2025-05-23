import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

const CloseButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button type="link" size="small" {...props}>
            <CloseOutlined style={{ color: "#EF4444", fontSize: 20 }} />
        </Button>
    );
};

export default CloseButton;
