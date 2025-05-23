"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import _ from "lodash";

import { useFormWrapperCtx } from "./FormWrapper";

import { PathInto } from "@/interfaces/form";
import { generateFormField } from "@/utils/form";

function deepCompareEquals(a: any, b: any) {
    return _.isEqual(a, b);
}

function useDeepCompareMemoize(value: any) {
    const ref = useRef();

    if (!deepCompareEquals(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

function useDeepCompareEffect(callback: any, dependencies: any[]) {
    useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export interface FormFieldProps<T extends FieldValues> {
    name: PathInto<T, true>;
    index?: number[];
}

const FormField = <T extends FieldValues>({ name, index }: FormFieldProps<T>) => {
    const [child, setChild] = useState<ReactNode | null>(null);
    const { fields } = useFormWrapperCtx();

    useDeepCompareEffect(() => {
        const field = fields[name];
        if (field) {
            if (field.componentProps) {
                field.componentProps.index = index;
            } else {
                field.componentProps = { index: index };
            }
        }
        if (field) {
            setChild(generateFormField({ ...field, name }));
        }
    }, [fields[name]]);

    return child;
};

export default FormField;
