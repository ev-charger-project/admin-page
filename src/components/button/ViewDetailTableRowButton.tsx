import React from "react";
import Image from "next/image";
import { Button, ButtonProps } from "antd";

const ViewDetailTableRowButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button type="link" size="small" {...props}>
            {props?.children ?? <Image src="/icons/eye.svg" alt="icon" width={16} height={16} />}
        </Button>
    );
};

export default ViewDetailTableRowButton;
