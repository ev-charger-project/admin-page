import React, { CSSProperties } from "react";
import { Flex } from "antd";

import CheckButton from "./CheckButton";
import CloseButton from "./CloseButton";
import EditButton from "./EditButton";
import { PageMode } from "@/interfaces/router";

type Props = {
    mode?: PageMode;
    onClickEdit?: () => void;
    onSubmit?: () => void;
    onClose?: () => void;
    style?: CSSProperties;
};

const EditButtonGroup: React.FC<Props> = ({ onClickEdit, mode, onClose, onSubmit, style }) => {
    return (
        <Flex style={style}>
            {mode === "view" && onClickEdit && <EditButton onClick={onClickEdit} />}
            {mode === "edit" && onSubmit && onClose && (
                <Flex>
                    <CheckButton onClick={onSubmit} />
                    <CloseButton onClick={onClose} />
                </Flex>
            )}
        </Flex>
    );
};

export default EditButtonGroup;
