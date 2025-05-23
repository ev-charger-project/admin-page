import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { useRouter } from "@/hook/router";
import React from "react";
import { EvUserPayload } from "@/interfaces/ev-user";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import Link from "next/link";
import SharedButton from "@/components/button/SharedButton";
import { c } from "@/utils/string";

interface UseGetEvUserComponent {
    Email: ComponentRenderer;
    Password: ComponentRenderer;
    Name: ComponentRenderer;
    Phone: ComponentRenderer;
    IsActive: ComponentRenderer;
    IsAdmin: ComponentRenderer;
    ImageButton: ComponentRenderer;
    CancelButton: ComponentRenderer;
    SaveButton: ComponentRenderer;
    DeleteButton: ComponentRenderer;
}

export interface UseGetEvUserComponentProps {
    userId?: string;
    onClickDelete?: () => void;
}

function useGetEvUserComponents({ userId, onClickDelete }: UseGetEvUserComponentProps): UseGetEvUserComponent {
    const router = useRouter();

    const { FormField } = useFormWrapperCtx<EvUserPayload>();

    return {
        Email: () => <FormField name="email" />,
        Password: () => (userId ? null : <FormField name="password" />),
        Name: () => <FormField name="name" />,
        Phone: () => <FormField name="phone_number" />,
        IsActive: () => <FormField name="is_active" />,
        IsAdmin: () => <FormField name="is_superuser" />,
        ImageButton: () => <FormField name="image_url" />,
        CancelButton: () => (
            <Link
                href={router.paths.get("users")}
                style={{
                    marginBottom: 50
                }}>
                <SharedButton title={c("Cancel")} customType="secondary" customSize="sm" />
            </Link>
        ),
        SaveButton: () => <SharedButton title={c("Save")} htmlType={"submit"} customType="action" customSize="sm" />,
        DeleteButton: () =>
            userId ? (
                <SharedButton title={c("Delete")} customType="danger" customSize="sm" onClick={onClickDelete} />
            ) : null
    };
}
export default useGetEvUserComponents;
