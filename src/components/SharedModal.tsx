import React, { ReactNode } from "react";
import { Modal, ModalProps } from "antd";
import styled from "styled-components";

type SharedModalProps = {
    children: ReactNode;
} & ModalProps;

const CustomModal = styled(Modal)`
    .ant-modal-content {
        padding: 40px !important;
    }
    .ant-modal-header {
        margin: 0 !important;
        .ant-modal-title {
            font-size: 20px;
            font-weight: 700;
            line-height: 24px;
        }
    }

    .ant-modal-body {
        padding-top: 48px !important;
    }
    .ant-modal-footer {
        margin: 0 !important;
    }
`;

const SharedModal = ({ children, ...props }: SharedModalProps) => {
    return (
        <CustomModal zIndex={99} {...props}>
            {children}
        </CustomModal>
    );
};

export default SharedModal;
