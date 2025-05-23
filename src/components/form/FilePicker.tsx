import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { InboxOutlined } from "@ant-design/icons";
import { message, Spin, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";

import { CommonFormItemProps, FormItem } from "./FormItem";

import { FileUploadType } from "@/constant/base";
import { getFileType } from "@/utils/file";
import { getObjectValueWithPath, includeIndexToName } from "@/utils/form";
import { replaceLastOccurrence } from "@/utils/string";
import { useFileDelete, useFileUpload } from "@/hook/file";

type CustomUploadFile = UploadFile & Record<string, any>;

export type FilePickerProps = UploadProps &
    CommonFormItemProps & {
        maxSize?: number;
        onDelete?: (remainValues: any[]) => void;
        onUploading?: (status: "start" | "success" | "error") => void;
    };

export const FilePicker: React.FC<FilePickerProps> = ({
    name,
    label,
    onDelete,
    onUploading,
    onChange: customChange,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    maxCount,
    maxSize,
    index,
    accept,
    ...rest
}) => {
    const { formState } = useFormContext();

    const finalName = useMemo(() => {
        return Array.isArray(index) && index.length > 0 ? includeIndexToName(name, index) : name;
    }, [index, name]);

    const onDraggedChange = (info: UploadChangeParam) => {
        const { status } = info.file;
        if (status !== "uploading") {
            //   console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`).then(() => {});
        } else if (status === "error") {
            message.error(`${info.file.name} file upload failed.`).then(() => {});
        }
        customChange?.(info);
    };

    const isError = useMemo<boolean>(() => {
        let errorMessage = getObjectValueWithPath(formState.errors, replaceLastOccurrence(finalName, ".[]", ".root"));

        if (!errorMessage) {
            errorMessage = getObjectValueWithPath(formState.errors, replaceLastOccurrence(finalName, ".[]", ""));
        }

        return !!(name && errorMessage);
    }, [finalName, formState, name]);

    const acceptTypeImage = accept ?? FileUploadType;
    const { mutateAsync: uploadAsync, isPending } = useFileUpload();
    const { mutateAsync: deleteAsync } = useFileDelete();
    return (
        <FormItem
            label={label}
            name={name}
            isRequired={isRequired}
            direction={direction}
            labelMinWidth={labelMinWidth}
            labelPosition={labelPosition}
            index={index}
            render={({ onChange, value }) => {
                const fileList: CustomUploadFile[] = [];
                if (value) {
                    fileList.push({
                        uid: "-1",
                        name: value,
                        status: "done",
                        url: `${process.env.NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL}/api/v1/media/${value}`
                    });
                }
                value = value ? [value] : [];
                return (
                    <Dragger
                        accept={acceptTypeImage}
                        onChange={onDraggedChange}
                        beforeUpload={async (file) => {
                            const fileType = getFileType(file?.name || "");
                            if (!acceptTypeImage.replaceAll(".", "").split(",").includes(fileType)) {
                                message.error(`Can't upload more file. The file type is not correct!`);
                                return false;
                            }
                            if (maxSize && file.size / 1000 > maxSize) {
                                message.error(`File size is too large. Maximum ${maxSize}KB`);
                                return false;
                            }
                            if (maxCount && value.length >= maxCount) {
                                message.error(`Can't upload more file. Maximum ${maxCount} file(s)!`);
                                return false;
                            }
                            try {
                                onUploading?.("start");
                                const formData = new FormData();
                                formData.append("file", file);
                                const resultUpload = await uploadAsync(formData);
                                onUploading?.("success");
                                onChange(resultUpload.data);
                                return false;
                            } catch (error) {
                                onUploading?.("error");
                                message.error(`${file.name} file upload failed`);
                                return false;
                            }
                        }}
                        onRemove={async (file) => {
                            try {
                                await deleteAsync(file.name);
                            } catch (error) {
                                message.error("Cannot delete file");
                                return;
                            }
                            if (maxCount === 1) {
                                onChange(undefined);
                                onDelete?.([]);
                            } else if (Array.isArray(value)) {
                                const remain = value.filter((i) => i !== file.url);
                                onChange(remain);
                                onDelete?.(remain);
                            }
                        }}
                        listType="picture-card"
                        showUploadList={{
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                            showPreviewIcon: true
                        }}
                        fileList={fileList}
                        style={{
                            border: `1px dashed ${isError ? "red" : "#d9d9d9"}`
                        }}
                        {...rest}>
                        <Spin spinning={isPending}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Spin>
                    </Dragger>
                );
            }}
        />
    );
};
