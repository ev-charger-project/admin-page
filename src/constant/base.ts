import { EnumStruct } from "@/interfaces/enum";
import { ModeRow } from "@/interfaces/models/base";

export const ModeRowEnum = Object.freeze({
    create: {
        label: "Create",
        value: "create"
    },
    update: {
        label: "Update",
        value: "update"
    },
    delete: {
        label: "Delete",
        value: "delete"
    }
}) satisfies EnumStruct<ModeRow>;

export const FileUploadType = ".doc,.docx,.xml,.pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.svg,.xlsm";
