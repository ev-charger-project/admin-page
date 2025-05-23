export type ModeRow = "update" | "delete" | "create";

export type TimeTracking = {
    updated_at: string | null;
    updated_by: string | null;
    created_at: string;
    created_by: string;
};
