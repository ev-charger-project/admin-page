import { FilterBase, MetaData } from "@/interfaces/base";

export interface WorkingDay extends MetaData {
    id: string;
    day: number;
    open_time: string;
    close_time: string;
}

export interface WorkingDayPayload extends Pick<WorkingDay, "day" | "open_time" | "close_time"> {}

export type GetListWorkingDayParams = FilterBase<WorkingDay>;
export type WorkingDayModel = WorkingDay;
