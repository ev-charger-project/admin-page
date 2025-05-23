import { EVERYTHING_BUT_NUMBERS } from "@/constant/regex";

export const formatPhoneNumber = (value: string) => {
    return value
        .trim()
        .replaceAll(EVERYTHING_BUT_NUMBERS, "")
        .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};

export const unFormatPhoneNumber = (value: string) => {
    return value.trim().replaceAll(EVERYTHING_BUT_NUMBERS, "");
};
