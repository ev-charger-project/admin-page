import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import { Flex } from "antd";
import React from "react";
import { CreateEVChargerPayload } from "@/interfaces/ev-charger";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useFieldArray, useFormContext } from "react-hook-form";
import { c } from "@/utils/string";
import SharedButton from "@/components/button/SharedButton";
import { ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { CustomColumnsType } from "@/interfaces/table";
import TableV1 from "@/components/TableV1";

interface FormRowData {
    power_plug_type: ComponentRenderer;
    power_output: ComponentRenderer;
}

function AddMultipleItems() {
    const methods = useFormContext<CreateEVChargerPayload>();
    const { FormField } = useFormWrapperCtx<CreateEVChargerPayload>();
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "ev_charger_ports"
    });

    const newEVChargerPortArray = React.useMemo(
        () => ({
            power_plug_type_id: undefined,
            power_output_id: undefined,
            id: undefined
        }),
        []
    );
    const handleAddItemClick = () => {
        append({ ...newEVChargerPortArray });
    };

    React.useEffect(() => {
        if (fields.length === 0) {
            append({ ...newEVChargerPortArray });
        }
    }, [fields, append, newEVChargerPortArray]);

    const formColumn = React.useMemo<CustomColumnsType<FormRowData, { no: number }>>(
        () => [
            {
                key: "no",
                title: c("Port"),
                width: "6%",
                dataIndex: "no",
                render: (_text, _record, index) => index + 1
            },
            {
                key: "power_plug_type",
                title: c("Power Plug Type"),
                dataIndex: "power_plug_type",
                width: "44%",
                render: (_text, _record, index) => (
                    <FormField
                        name="ev_charger_ports.[].power_plug_type_id"
                        index={[index]}
                        key={index + "power_plug_type_id"}
                    />
                )
            },
            {
                key: "power_output",
                title: c("Power Output"),
                dataIndex: "power_output",
                width: "44%",
                render: (_text, _record, index) => (
                    <FormField
                        name="ev_charger_ports.[].power_output_id"
                        index={[index]}
                        key={index + "power_output_id"}
                    />
                )
            },
            {
                key: "action",
                title: c(""),
                dataIndex: "action",
                width: "6%",
                render: (_text, _record, index) => (
                    <DeleteOutlined
                        style={{
                            fontSize: 18,
                            color: "#D0D5DD"
                        }}
                        onClick={() => {
                            remove(index);
                        }}
                    />
                )
            }
        ],
        [remove]
    );

    return (
        <Flex
            style={{
                padding: "24px"
            }}
            vertical
            gap={8}>
            <TableV1
                rowKey={(row) => row.id}
                dataSource={fields}
                columns={formColumn}
                tableTitle={c("Ports of EV Charger")}
                pagination={false}
                bordered={false}
            />

            <Flex
                gap={40}
                style={{
                    marginTop: 24
                }}>
                <SharedButton
                    title={c("Add Charger Port")}
                    icon={<PlusOutlined />}
                    customType="action"
                    customSize="sm"
                    onClick={handleAddItemClick}
                />
            </Flex>
        </Flex>
    );
}
export default AddMultipleItems;
