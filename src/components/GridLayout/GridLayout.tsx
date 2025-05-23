import React from "react";
import { Col, Row as SDKRow } from "antd";
import { Gutter } from "antd/es/grid/row";
import { isFunction, isObject } from "lodash";
import isNil from "lodash/isNil";
import styled from "styled-components";

import { Invisible } from "./Invisible";
import { SectionTitle } from "./SectionTitle";
import { Spacer } from "./Spacer";

import {
    AvailGridItemVariants,
    ComponentRenderer,
    GridLayoutItem,
    GridLayoutProps,
    GridLayoutSchema,
    RenderComponentsFromSchemaOutput,
    RenderGridItemOutput,
    RenderGridItemParams,
    ScreenBreakpoints
} from "@/interfaces/Gridlayout.type";

function Row({ children, gutter = 16 }: { children: any; gutter?: Gutter | [Gutter, Gutter] }) {
    return <SDKRow gutter={gutter}>{children}</SDKRow>;
}

export function GridLayout({ schema }: GridLayoutProps): JSX.Element {
    let schemas: GridLayoutSchema[];
    if (Array.isArray(schema)) {
        schemas = schema;
    } else {
        schemas = [schema];
    }

    return (
        <>
            {schemas.map((schema, index) => {
                const { componentView } = renderComponentsFromSchema(schema);

                return <React.Fragment key={index}>{componentView}</React.Fragment>;
            })}
        </>
    );
}

function renderComponentsFromSchema(schema: GridLayoutSchema): RenderComponentsFromSchemaOutput {
    let hasRenderedComponent = false;

    if (schema.isVisible && !schema.isVisible()) {
        return {
            componentView: <></>,
            hasRenderedComponent
        };
    }

    const gridView: React.ReactNode = schema.gridItems.map((gridItem, index) => {
        const {
            componentView,
            hasRenderedComponent: _hasRenderedComponent,
            shouldAffectGroupVisibility
        } = renderGridItem({ gridItem, schema });

        hasRenderedComponent = hasRenderedComponent || (_hasRenderedComponent && shouldAffectGroupVisibility);
        return <React.Fragment key={index}>{componentView}</React.Fragment>;
    });
    let componentView: React.ReactNode;
    if (!hasRenderedComponent) {
        componentView = <></>;
    } else {
        const topDividerEl = schema.topDividerEl || <hr />;
        const GroupContainerEl = schema.groupContainerEl || React.Fragment;
        componentView = (
            <>
                {schema.hasTopDivider && topDividerEl}
                <GroupContainerEl>
                    {!!schema.groupLabel && <SectionTitle label={schema.groupLabel} />}
                    {!!schema.groupLabelEl && schema.groupLabelEl}
                    <Row gutter={schema?.gutter || schema?.defaultItemGutter}>{gridView}</Row>
                </GroupContainerEl>
                {!!schema.bottomSpace && <Spacer height={schema.bottomSpace} />}
            </>
        );
    }

    return {
        componentView,
        hasRenderedComponent
    };
}

export function renderGridItem({
    gridItem,
    schema,
    isRenderedFromComponentGridItem = false
}: RenderGridItemParams): RenderGridItemOutput {
    const result: RenderGridItemOutput = {
        hasRenderedComponent: false,
        componentView: null,
        shouldAffectGroupVisibility: true
    };

    if (isNil(gridItem)) {
        return result;
    }

    let screenBreakpoints: ScreenBreakpoints = fullRowScreenBreakpoints,
        bottomItemSpace: string | undefined,
        topSpace: string | undefined;
    let componentView: React.ReactNode;

    const isComponentRenderer = isFunction(gridItem);
    if (isComponentRenderer) {
        screenBreakpoints = schema.defaultItemBreakpoints as ScreenBreakpoints;
        bottomItemSpace = schema.bottomItemSpace as string;
        result.hasRenderedComponent = true;
        componentView = (gridItem as ComponentRenderer)();
    }

    const isListOfComponentVariant = Array.isArray(gridItem);
    if (isListOfComponentVariant) {
        const componentVariants = gridItem as AvailGridItemVariants[];
        const componenEls = componentVariants
            .map((componentRenderer) => renderGridItem({ gridItem: componentRenderer, schema }))
            .map((rs, index) => {
                result.hasRenderedComponent = result.hasRenderedComponent || rs.hasRenderedComponent;
                return <React.Fragment key={index}>{rs.componentView}</React.Fragment>;
            });
        componentView = <Row gutter={schema?.gutter || schema?.defaultItemGutter}>{componenEls}</Row>;
    }

    const isSchema = isObject(gridItem) && !!(gridItem as GridLayoutSchema)?.gridItems;

    if (isSchema) {
        const componentSchema = gridItem as GridLayoutSchema;
        if (!componentSchema.defaultItemBreakpoints) {
            componentSchema.defaultItemBreakpoints = schema.defaultItemBreakpoints;
        }

        if (!componentSchema.bottomItemSpace) {
            componentSchema.bottomItemSpace = schema.bottomItemSpace;
        }
        if (!componentSchema.defaultItemGutter) {
            componentSchema.defaultItemGutter = schema.defaultItemGutter;
        }

        screenBreakpoints = componentSchema.screenBreakpoints as ScreenBreakpoints;
        const rs = renderComponentsFromSchema(componentSchema);
        if (!rs.hasRenderedComponent) {
            return result;
        }

        componentView = rs.componentView;
        result.hasRenderedComponent = rs.hasRenderedComponent;
    }

    const isComponentGridItem = !isComponentRenderer && !isListOfComponentVariant && !isSchema;
    if (isComponentGridItem) {
        const componentGridItem = gridItem as GridLayoutItem;
        const isNotVisible = isFunction(componentGridItem.isVisible) && !componentGridItem.isVisible();
        const isEmptyComponent = !componentGridItem.component;
        topSpace = componentGridItem.topSpace as string;

        if (isNotVisible || isEmptyComponent) {
            return result;
        }

        screenBreakpoints = (componentGridItem.screenBreakpoints || schema.defaultItemBreakpoints) as ScreenBreakpoints;
        bottomItemSpace = (componentGridItem.bottomSpace || schema.bottomItemSpace) as string;

        const rs = renderGridItem({
            gridItem: componentGridItem.component,
            schema,
            isRenderedFromComponentGridItem: true
        });

        if (componentGridItem.shouldAffectGroupVisibility === false) {
            result.shouldAffectGroupVisibility = false;
        }

        result.hasRenderedComponent = rs.hasRenderedComponent;
        componentView = rs.componentView;
    }

    if (!result.hasRenderedComponent) {
        result.componentView = <></>;
        return result;
    }

    if (isRenderedFromComponentGridItem) {
        result.componentView = componentView;
        return result;
    }

    // const screenBreakpointsInString = mapValues(
    //   screenBreakpoints,
    //   (breakpoint) => breakpoint && breakpoint.toString()
    // );

    if (isComponentRenderer || isComponentGridItem) {
        result.componentView = (
            <AutoInvisibleCol {...screenBreakpoints}>
                {topSpace && <Spacer height={topSpace} />}
                {componentView}
                {bottomItemSpace && <Spacer height={bottomItemSpace} />}
            </AutoInvisibleCol>
        );
    }

    if (isSchema || isListOfComponentVariant) {
        result.componentView = <AutoInvisibleCol {...screenBreakpoints}>{componentView}</AutoInvisibleCol>;
    }

    return result;
}

export const fullRowScreenBreakpoints: ScreenBreakpoints = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12
};

const AutoInvisibleCol = styled(Col)`
    &:has(> ${Invisible}) {
        display: none;
    }
`;
