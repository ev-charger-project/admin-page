import ConfirmActionModal, { ConfirmActionModalProps } from "@/components/ConfirmActionModal";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import React from "react";

type ActionModalContext = {
    showModal: (params: ConfirmActionModalProps & { autoCloseModal?: boolean }) => void;
    toggleLoading: (confirmLoading: boolean) => void;
    closeModal: () => void;
};

const actionModalContext = createContext<ActionModalContext>({} as ActionModalContext);

export function useActionModal() {
    return useContext(actionModalContext);
}
function ActionModalProvider({ children }: { children: React.ReactNode }) {
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [autoCloseModal, setAutoCloseModal] = useState<boolean>(true);
    const [cancelAction, setCancelAction] = useState<undefined | (() => void)>(undefined);
    const [confirmAction, setConfirmAction] = useState<undefined | (() => void)>(undefined);
    const [actionContent, setActionContent] = useState("");

    function showModal({
        content,
        onCancel,
        onOk,
        autoCloseModal
    }: ConfirmActionModalProps & { autoCloseModal?: boolean }) {
        setActionContent(content);
        setCancelAction(function () {
            return onCancel;
        });
        setConfirmAction(function () {
            return onOk;
        });
        setIsActionOpen(true);
        if (autoCloseModal !== undefined) {
            setAutoCloseModal(autoCloseModal);
        }
    }

    function toggleLoading(confirmLoading: boolean) {
        setConfirmLoading(confirmLoading);
    }

    function closeModal() {
        setIsActionOpen(false);
        setConfirmLoading(false);
    }

    function onCloseAction() {
        if (cancelAction) {
            cancelAction();
        }
        closeModal();
    }

    function onOkAction() {
        if (confirmAction) {
            confirmAction();
        }
        if (autoCloseModal) closeModal();
    }

    useEffect(
        function () {
            if (!isActionOpen) {
                setActionContent("");
                setCancelAction(undefined);
                setConfirmAction(undefined);
            }
        },
        [isActionOpen]
    );

    const value = useMemo(
        function () {
            return { showModal, toggleLoading, closeModal };
        },
        [showModal, toggleLoading, closeModal]
    );

    return (
        <actionModalContext.Provider value={value}>
            <ConfirmActionModal
                content={actionContent}
                open={isActionOpen}
                onCancel={onCloseAction}
                onOk={onOkAction}
                confirmLoading={confirmLoading}
            />
            {children}
        </actionModalContext.Provider>
    );
}

export default ActionModalProvider;
