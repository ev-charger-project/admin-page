import React from "react";
import { SaveOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

const CheckButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button type="link" size="small" {...props}>
            <SaveOutlined style={{ fontSize: 20 }} />
        </Button>
    );
};

export default CheckButton;
