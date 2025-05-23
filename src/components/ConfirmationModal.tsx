import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { Modal, ModalProps } from "antd";
import styled from "styled-components";

import { c } from "@/utils/string";

export type ConfirmModalType = "success" | "warning";

type ConfirmationModalProps = Omit<ModalProps, "onCancel"> & {
    content: string;
    onCancel: () => void;
    type: ConfirmModalType;
};

let ConfirmationModal: React.FC<ConfirmationModalProps> = ({ content, open, onCancel, type, ...rest }) => {
    const iconSrc = useMemo(() => {
        if (type === "success") {
            return "/icons/confirmation-icon.png";
        }
        if (type === "warning") {
            return "/icons/warning-icon.png";
        }

        return "/icons/confirmation-icon.png";
    }, [type]);
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (open && onCancel) {
            // Set a timeout to close the modal after 5 seconds
            timeoutId = setTimeout(() => {
                if (onCancel) {
                    onCancel();
                }
            }, 5000);
        }

        return () => {
            // Clear the timeout when the component unmounts or when isConfirmModalOpen changes
            clearTimeout(timeoutId);
        };
    }, [onCancel, open]);

    return (
        <Modal footer={null} title={null} width={492} open={open} onCancel={onCancel} centered={true} {...rest}>
            <div
                style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "column"
                }}>
                <Image alt={c("Confirmation icon")} width={48} height={48} src={iconSrc} />
                <div
                    style={{
                        textAlign: "center"
                    }}>
                    <h3
                        style={{
                            fontSize: "24px",
                            marginTop: "0px"
                        }}>
                        {content}
                    </h3>
                </div>
            </div>
        </Modal>
    );
};

ConfirmationModal = styled(ConfirmationModal)`
    .ant-modal-content {
        padding: 56px 36px !important;
    }
`;

export default ConfirmationModal;
