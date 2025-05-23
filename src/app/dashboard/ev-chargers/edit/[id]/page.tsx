"use client";
import React from "react";
import { useParams } from "next/navigation";
import AddEditEVCharger from "@/container/ev-charger/AddEditEVCharger";

function EditEVCharger(): React.JSX.Element {
    const { id } = useParams<{ id: string }>();
    return <AddEditEVCharger EVChargerId={id} />;
}

export default EditEVCharger;
