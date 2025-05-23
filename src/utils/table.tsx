import React from "react";
import { RenderedCell } from "rc-table/lib/interface";

import { c } from "./string";

import { CustomColumnsType } from "@/interfaces/table";
import { formatCurrency } from "@/components/form/CurrencyField";

export const generateColumns = <T extends Record<string, any>, U extends Record<string, any>>(
    columns: CustomColumnsType<T, U>
) => {
    const isRenderedCell = (object: any): object is RenderedCell<T> => {
        return object !== null && typeof object === "object" && "children" in object;
    };

    return columns.map<CustomColumnsType<T, U>[0]>((column) => {
        return {
            ...column,
            render: (text, record, index) => {
                let formattedText = text;
                if (column.currencyFormat) {
                    formattedText = formatCurrency(formattedText);
                }
                const rendered = column.render ? column.render(formattedText, record, index) : c(formattedText);
                let data: React.ReactNode = <div style={{ visibility: "hidden" }}>blank</div>;
                if (isRenderedCell(rendered)) {
                    data = rendered.children;
                } else {
                    data = <>{rendered}</>;
                }
                return data;
            }
        };
    });
};
