import { Modal, ModalProps } from "antd";
import React from "react";

export interface ConfirmActionModalProps extends ModalProps {
    title?: string;
    content: string;
}

function ConfirmActionModal(props: ConfirmActionModalProps) {
    return (
        <Modal
            title={props.title}
            open={props.open}
            onCancel={props.onCancel}
            centered={true}
            onOk={props.onOk}
            confirmLoading={props.confirmLoading}>
            {/*<Image alt={c("Confirmation icon")} width={48} height={48} src={iconSrc} />*/}
            <div
                style={{
                    textAlign: "center",
                    padding: "60px"
                }}>
                <p>{props.content}</p>
            </div>
        </Modal>
    );
}

export default ConfirmActionModal;
