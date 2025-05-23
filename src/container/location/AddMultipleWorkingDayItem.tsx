import { useFormWrapperCtx } from "@/components/form/FormWrapper";
import React, { useEffect, useState } from "react";
import { c } from "@/utils/string";
import { AvailGridItemVariants, ComponentRenderer } from "@/interfaces/Gridlayout.type";
import { CreateLocationPayload } from "@/interfaces/location";
import { GridLayout } from "@/components/GridLayout/GridLayout";

import { Typography } from "antd";
import { themeConstants } from "@/constant/theme";

import { WorkingDayLabel } from "@/constant/enum/Location";
import { useFormContext } from "react-hook-form";
import SharedButton from "@/components/button/SharedButton";

const { Title } = Typography;

interface WorkingDayField {
    WorkingDays: ComponentRenderer;
    WorkingDayOpen: ComponentRenderer;
    WorkingDayClose: ComponentRenderer;
}

function getWorkingDayComponent({
    day_idx = 0,
    showGlobalError = false
}: {
    day_idx?: number;
    showGlobalError?: boolean;
}): WorkingDayField {
    const { FormField } = useFormWrapperCtx<CreateLocationPayload>();
    return {
        WorkingDays: () => <>{showGlobalError ? <FormField name="working_days" /> : null}</>,
        WorkingDayOpen: () => (
            <FormField name="working_days.[].open_time" index={[day_idx]} key={day_idx + "open_time"} />
        ),
        WorkingDayClose: () => (
            <FormField name="working_days.[].close_time" index={[day_idx]} key={day_idx + "close_time"} />
        )
    };
}

export default function AddMultipleItems() {
    const methods = useFormContext<CreateLocationPayload>();
    const [showGlobalError, setShowGlobalError] = useState<boolean>(false);
    useEffect(() => {
        if (methods.getFieldState("working_days").error?.message !== undefined) {
            setShowGlobalError(true);
        } else {
            setShowGlobalError(false);
        }
    }, [methods.getFieldState("working_days").error]);

    const generateWorkingDayField = () => {
        const gridItemsIndividualDays: AvailGridItemVariants[] = [];
        for (let i = 0; i < 7; i++) {
            gridItemsIndividualDays.push({
                screenBreakpoints: {
                    xl: 8
                },
                groupLabelEl: <Title level={5}>{c(WorkingDayLabel[i])}</Title>,
                gutter: [20, 20],
                gridItems: [
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        gridItems: [
                            {
                                screenBreakpoints: {
                                    xl: 12
                                },
                                component: getWorkingDayComponent({ day_idx: i }).WorkingDayOpen
                            },
                            {
                                screenBreakpoints: {
                                    xl: 12
                                },
                                component: getWorkingDayComponent({ day_idx: i }).WorkingDayClose
                            }
                        ]
                    },
                    {
                        screenBreakpoints: {
                            xl: 24
                        },
                        component: () => (
                            <SharedButton
                                title={c("Apply To All")}
                                customType={"action"}
                                customDisabled={
                                    (methods.getValues()["working_days"][i]["open_time"] == "" &&
                                        methods.getValues()["working_days"][i]["close_time"] == "") ||
                                    methods.getFieldState(`working_days.${i}`).invalid
                                }
                                onClick={() => {
                                    for (let j = 0; j < 7; j++) {
                                        methods.setValue(
                                            `working_days.${j}.open_time`,
                                            methods.getValues()["working_days"][i]["open_time"]
                                        );
                                        methods.setValue(
                                            `working_days.${j}.close_time`,
                                            methods.getValues()["working_days"][i]["close_time"]
                                        );
                                    }
                                    methods.trigger("working_days");
                                }}
                            />
                        )
                    }
                ]
            });
        }
        gridItemsIndividualDays.push({
            screenBreakpoints: {
                xl: 12
            },
            component: getWorkingDayComponent({ showGlobalError: showGlobalError }).WorkingDays
        });

        return gridItemsIndividualDays;
    };

    return (
        <GridLayout
            schema={{
                screenBreakpoints: {
                    xl: 24
                },
                gutter: [40, 40],
                groupLabelEl: (
                    <Title
                        style={{
                            color: themeConstants.titleDefault
                        }}
                        level={4}>
                        {c("Working Day")}
                    </Title>
                ),
                gridItems: generateWorkingDayField()
            }}
        />
    );
}
