import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import React from "react";

import ConfirmationModal, { ConfirmModalType } from "@/components/ConfirmationModal";

type ShowModalParams = {
    content: string;
    onClose?: () => void;
    type: ConfirmModalType;
};

type FormModalContext = {
    showModal: (params: ShowModalParams) => void;
};

const formModalContext = createContext<FormModalContext>({} as FormModalContext);

export const useFormModal = () => useContext(formModalContext);

const FormModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [closeConfirm, setCloseConfirm] = useState<undefined | (() => void)>(undefined);
    const [confirmContent, setConfirmContent] = useState("");
    const [confirmModalType, setConfirmModalType] = useState<ConfirmModalType>("success");

    const showModal = useCallback(({ content, onClose, type }: ShowModalParams) => {
        setConfirmModalType(type);
        setConfirmContent(content);
        setCloseConfirm(() => {
            return onClose;
        });
        setIsConfirmOpen(true);
    }, []);

    const onCloseConfirm = () => {
        if (closeConfirm) {
            closeConfirm();
        }
        setIsConfirmOpen(false);
    };

    useEffect(() => {
        if (!isConfirmOpen) {
            setConfirmContent("");
            setCloseConfirm(() => undefined);
        }
    }, [isConfirmOpen]);

    const value = useMemo(() => ({ showModal }), [showModal]);

    return (
        <formModalContext.Provider value={value}>
            <ConfirmationModal
                open={isConfirmOpen}
                content={confirmContent}
                onCancel={() => onCloseConfirm()}
                type={confirmModalType}
            />
            {children}
        </formModalContext.Provider>
    );
};

export default FormModalProvider;
