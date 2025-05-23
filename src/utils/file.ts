export const blobToFile = async (
    blobUrl: string | null | undefined,
    fileName: string | null | undefined
): Promise<File> => {
    if (!blobUrl) {
        throw new Error("blobUrl is required");
    }

    if (!fileName) {
        throw new Error("fileName is required");
    }

    const blob = await fetch(blobUrl).then((r) => r.blob());

    const file = new File([blob], fileName, {
        type: blob.type
    });

    return file;
};

export const getFileName = (link: string) => {
    const url = new URL(link);
    url.search = "";
    const tmpLink = url.toString();
    const fileName = tmpLink.substring(tmpLink.lastIndexOf("/") + 1);
    return fileName.substring(0, fileName.lastIndexOf("."));
};

export const getFileType = (name: string) => {
    const lastDotIndex = name.lastIndexOf(".");
    return lastDotIndex === -1 || lastDotIndex === name.length - 1 ? "" : name.slice(lastDotIndex + 1);
};
