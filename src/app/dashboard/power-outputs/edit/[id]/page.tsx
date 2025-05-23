"use client";
import AddEditPowerOutput from "@/container/power-output/AddEditPowerOutput";
import { useParams } from "next/navigation";
import React from "react";

export default function EditPowerPlugType(): React.JSX.Element {
    const { id } = useParams<{ id: string }>();
    return <AddEditPowerOutput powerOutputId={id} />;
}
