import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "antd";

const EditButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button type="link" size="small" {...props}>
            <EditOutlined style={{ fontSize: 20 }} />
        </Button>
    );
};

export default EditButton;
