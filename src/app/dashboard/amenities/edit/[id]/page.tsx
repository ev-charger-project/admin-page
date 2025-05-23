import React from "react";
import AddEditAmenity from "@/container/amenities/AddEditAmenity";

export default function EditAmenityPage({ params }: { params: { id: string } }) {
    return <AddEditAmenity amenityId={params.id} />;
}
