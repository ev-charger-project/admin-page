import { ReactNode } from "react";
import { Input, InputNumber } from "antd";
import styled from "styled-components";

export const StyledInput = styled(Input)<{
    disabled?: boolean;
    addonBefore?: ReactNode;
}>`
    padding: ${(props) => (props.addonBefore ? "0px 0px" : "10px 16px")};
    font-size: 14px;
    line-height: 18px;
    display: inline-block;
    border-radius: 8px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: ${(props) => (props.disabled || props.addonBefore ? "none" : "1px solid #CCD1D4")};
`;

export const StyledInputNumber = styled(InputNumber<number>)<{
    disabled?: boolean;
}>`
    padding: 10px 16px;
    font-size: 14px;
    line-height: 18px;
    display: inline-block;
    border-radius: 8px;
    height: 40px;
    border: ${(props) => (props.disabled ? "none" : "1px solid #CCD1D4")};
`;
