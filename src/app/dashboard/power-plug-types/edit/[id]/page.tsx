"use client";
import React from "react";
import { useParams } from "next/navigation";
import AddEditPowerPlugType from "@/container/power-plug-type/AddEditPowerPlugType";

function EditPowerPlugType(): React.JSX.Element {
    const { id } = useParams<{ id: string }>();
    return <AddEditPowerPlugType powerPlugTypeId={id} />;
}

export default EditPowerPlugType;
