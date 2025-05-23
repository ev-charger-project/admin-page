import React from "react";
import { DeleteOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { Flex, message, UploadProps } from "antd";
import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";
import styled from "styled-components";

import SharedButton from "../button/SharedButton";
import { CommonFormItemProps, FormItem } from "./FormItem";

import { FileUploadType } from "@/constant/base";
import { getFileType } from "@/utils/file";
import { useFileDelete, useFileUpload } from "@/hook/file";

export type CustomUploadFile = UploadFile & Record<string, any>;

export type FilePickerV2Props = UploadProps &
    CommonFormItemProps & {
        maxSize?: number;
        onDelete?: (remainValues: any[]) => void;
        onUploading?: (status: "start" | "success" | "error") => void;
    };

let FilePickerV2: React.FC<FilePickerV2Props> = ({
    name,
    label,
    onUploading,
    onChange: customChange,
    isRequired = false,
    direction,
    labelMinWidth,
    labelPosition,
    maxCount,
    maxSize,
    index,
    onDelete,
    accept,
    ...rest
}) => {
    const { mutateAsync: uploadAsync, isPending: isLoadingUpload } = useFileUpload();
    const { mutateAsync: deleteAsync } = useFileDelete();
    const onUploadChange = (info: UploadChangeParam) => {
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

    const acceptTypeImage = accept ?? FileUploadType;

    return (
        <FormItem
            label={label}
            name={name}
            isRequired={isRequired}
            direction={direction}
            labelMinWidth={labelMinWidth}
            labelPosition={labelPosition}
            index={index}
            style={{ width: "100%" }}
            render={({ onChange, value = [] }) => {
                value = value ?? [];
                let fileList: CustomUploadFile[] = [];
                if (Array.isArray(value) && value.length > 0) {
                    fileList = value.map<CustomUploadFile>((i) => {
                        const uri = `${process.env.NEXT_PUBLIC_EV_CHARGER_SERVICE_BASE_URL}/media/${i}`;
                        const url = new URL(uri);
                        const size = url.searchParams.get("size");
                        const uploadDate = new Date(url.searchParams.get("uploadDate") ?? new Date());
                        const lastModifiedDate = new Date(url.searchParams.get("lastModifiedDate") ?? new Date());
                        return {
                            name: url.searchParams.get("name") ?? "",
                            uid: url.searchParams.get("uid") ?? "",
                            status: "done",
                            size: size ? +(Math.round((+size / 1000) * 100) / 100).toFixed(2) : 0,
                            lastModifiedDate,
                            uploadDate,
                            link: i
                        };
                    });
                }
                return (
                    <>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: 16,
                                color: "#263e56",
                                paddingBottom: 24
                            }}>
                            ({fileList.length}) Upload Complete
                        </h3>
                        <Flex
                            style={{
                                marginBottom: 24,
                                width: "100%"
                            }}
                            vertical
                            gap={8}>
                            {fileList
                                .filter((f) => f.status !== "error")
                                .map((file) => (
                                    <Flex key={file.uid} justify="space-between" gap={24} style={{ width: "100%" }}>
                                        <Flex
                                            justify="space-between"
                                            gap={24}
                                            style={{
                                                width: "100%",
                                                border: "solid 1px rgba(152, 162, 179, 0.4)",
                                                padding: 8,
                                                borderRadius: 4
                                            }}>
                                            <Flex
                                                style={{
                                                    width: 200,
                                                    fontWeight: 600,
                                                    color: "#667085",
                                                    lineHeight: 1.43,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }}
                                                gap={8}>
                                                <FileTextOutlined
                                                    style={{
                                                        width: "13.3px",
                                                        height: "16px",
                                                        color: "#667085"
                                                    }}
                                                />
                                                {file.name}
                                            </Flex>
                                            <div style={{ fontSize: 12 }}>
                                                {file.uploadDate
                                                    ?.toLocaleString("en-US", {
                                                        month: "numeric",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                        hour12: true,
                                                        timeZoneName: "short",
                                                        timeZone: "America/New_York"
                                                    })
                                                    .replace(",", "")}
                                            </div>
                                            <div style={{ fontSize: 12 }}>{file.size}.kb</div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "#667085"
                                                }}>
                                                {(file.name.split(".").pop() ?? "").toUpperCase()}
                                            </div>
                                        </Flex>

                                        <DeleteOutlined
                                            style={{
                                                width: 16.7,
                                                height: 20,
                                                color: "#263e56",
                                                margin: "auto"
                                            }}
                                            onClick={async () => {
                                                try {
                                                    await deleteAsync(file.name);
                                                } catch (error) {
                                                    message.error("Cannot delete file");
                                                    return;
                                                }
                                                if (maxCount === 1) {
                                                    onChange([]);
                                                    onDelete?.([]);
                                                } else if (Array.isArray(value)) {
                                                    const remain = value.filter((i) => i !== file.link);
                                                    onChange(remain);
                                                    onDelete?.(remain);
                                                }
                                            }}
                                        />
                                    </Flex>
                                ))}
                        </Flex>
                        <Upload
                            accept={acceptTypeImage}
                            onChange={onUploadChange}
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
                                    const uploadFile: CustomUploadFile = {
                                        name: resultUpload.data.split("/").pop() ?? "",
                                        uid: file.uid,
                                        type: file.type,
                                        size: file.size,
                                        lastModifiedDate: file.lastModifiedDate,
                                        uploadDate: new Date()
                                    };
                                    const searchParams = new URLSearchParams(uploadFile);

                                    const link = resultUpload.data + `?${searchParams.toString()}`;
                                    onUploading?.("success");

                                    onChange([...value, link]);
                                    return false;
                                } catch (error) {
                                    onUploading?.("error");
                                    message.error(`${file.name} file upload failed`);
                                    return false;
                                }
                            }}
                            showUploadList={false}
                            fileList={fileList}
                            {...rest}>
                            <SharedButton
                                icon={<UploadOutlined />}
                                customType="action"
                                title={"Upload File"}
                                loading={isLoadingUpload}
                            />
                        </Upload>
                    </>
                );
            }}
        />
    );
};

FilePickerV2 = styled(FilePickerV2)`
    .ant-upload-select {
        width: 100%;
    }
`;
export default FilePickerV2;
