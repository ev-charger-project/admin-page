import * as React from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { Alert } from "antd";

import FormField, { FormFieldProps } from "./FormField";

import { FieldsData } from "@/interfaces/form";
import { useAppDispatch, useAppSelector } from "@/store";
import { generateUid } from "@/utils/random";
import { removeShouldNavigateItemThunk, selectShouldNavigate, setShouldNavigatesItemThunk } from "@/store/router";

interface FormWrapperProps<T extends FieldValues = any, V = any> {
    methods: UseFormReturn<T, V>;
    children: React.ReactNode | ((props: FormContextType<T>) => React.ReactNode);
    fields: FieldsData<T>;
}

export interface FormContextType<T extends FieldValues = any> {
    fields: FieldsData<T>;
    FormField: React.FC<FormFieldProps<T>>;
}

export const FormContext = React.createContext<FormContextType>({} as FormContextType);
export const useFormWrapperCtx = <T extends FieldValues = any>() => React.useContext<FormContextType<T>>(FormContext);

const FormFieldWithType = <T extends FieldValues>(props: FormFieldProps<T>) => {
    return <FormField<T> {...props} />;
};

export function FormWrapper<T extends FieldValues, V>({ children, methods, fields }: FormWrapperProps<T, V>) {
    const dispatch = useAppDispatch();
    const shouldNavigate = useAppSelector(selectShouldNavigate);

    const [uid] = React.useState(generateUid());

    React.useEffect(() => {
        const payload = {
            id: uid,
            shouldNavigate: !methods.formState.isDirty
        };
        dispatch(setShouldNavigatesItemThunk(payload));
    }, [dispatch, methods.formState.isDirty, uid]);

    React.useEffect(() => {
        return () => {
            dispatch(removeShouldNavigateItemThunk(uid));
        };
    }, [dispatch, uid]);

    React.useEffect(() => {
        const handleUnload = (event: BeforeUnloadEvent) => {
            // Recommended
            event.preventDefault();

            // Included for legacy support, e.g. Chrome/Edge < 119
            event.returnValue = true;
        };
        if (!shouldNavigate) {
            window.addEventListener("beforeunload", handleUnload);
        }
        if (shouldNavigate) {
            window.removeEventListener("beforeunload", handleUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, [shouldNavigate]);

    const value = React.useMemo(
        () => ({
            fields,
            FormField: FormFieldWithType
        }),
        [fields]
    );

    const error = methods.formState.errors["form_error"]?.message as string;

    return (
        <FormProvider {...methods}>
            <FormContext.Provider value={value}>
                <div>
                    {error && (
                        <div style={{ paddingBottom: "10px" }}>
                            <Alert message={error} type="error" />
                        </div>
                    )}
                    {typeof children === "function" ? children(value) : children}
                </div>
            </FormContext.Provider>
        </FormProvider>
    );
}
