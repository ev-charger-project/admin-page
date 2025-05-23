import React from "react";
import AddEditLocation from "@/container/location/AddEditLocation";

export default function EditLocationPage({ params }: { params: { id: string } }) {
    return <AddEditLocation locationId={params.id} />;
}
