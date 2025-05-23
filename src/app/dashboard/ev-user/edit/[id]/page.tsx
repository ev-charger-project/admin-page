"use client";
import React from "react";
import { useParams } from "next/navigation";
import AddEditEvUser from "@/container/ev-user/AddEditEvUser";

function EditEvUser(): React.JSX.Element {
    const { id } = useParams<{ id: string }>();
    return <AddEditEvUser EvUserId={id} />;
}

export default EditEvUser;
