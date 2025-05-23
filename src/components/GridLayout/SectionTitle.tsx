import React from "react";

export interface SectionTitleProps {
    label: string;
}

export function SectionTitle({ label }: SectionTitleProps) {
    return (
        <h2>
            <b>{label}</b>
        </h2>
    );
}
