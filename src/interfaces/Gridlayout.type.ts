import { Gutter } from "antd/es/grid/row";

export const ScreenBreakpoints = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
] as const;
export type xl = (typeof ScreenBreakpoints)[number];
export type lg = (typeof ScreenBreakpoints)[number];
export type md = (typeof ScreenBreakpoints)[number];
export type sm = (typeof ScreenBreakpoints)[number];
export type xs = (typeof ScreenBreakpoints)[number];

export type SizePerScreenBreakpoint = [xl, lg, md, sm, xs];

export interface ScreenBreakpoints {
    xs?: xs;
    sm?: sm;
    md?: md;
    lg?: lg;
    xl?: xl;
}

export type ComponentRenderer = () => React.ReactNode;

export interface GridLayoutProps {
    schema: GridLayoutSchema | GridLayoutSchema[];
}

export interface GridLayoutSchema {
    screenBreakpoints?: ScreenBreakpoints;
    defaultItemBreakpoints?: ScreenBreakpoints;
    gridItems: AvailGridItemVariants[];
    isVisible?: () => boolean;
    groupLabel?: string;
    groupLabelEl?: React.ReactNode;
    bottomItemSpace?: string;
    bottomSpace?: string;
    hasTopDivider?: boolean;
    topDividerEl?: React.ReactNode;
    groupContainerEl?: ((data: { children: any }) => JSX.Element) | React.FC;
    gutter?: Gutter | [Gutter, Gutter];
    defaultItemGutter?: Gutter | [Gutter, Gutter];
}

export type AvailGridItemVariants =
    | GridLayoutItem
    | ComponentRenderer
    | GridLayoutSchema
    | Array<GridLayoutItem | ComponentRenderer | GridLayoutSchema | AvailGridItemVariants>;

export interface GridLayoutItem {
    component: AvailGridItemVariants;
    isVisible?: () => boolean;
    screenBreakpoints?: ScreenBreakpoints;
    bottomSpace?: string;
    topSpace?: string;
    shouldAffectGroupVisibility?: boolean;
    gutter?: Gutter | [Gutter, Gutter];
}

export interface RenderComponentsFromSchemaOutput {
    hasRenderedComponent: boolean;
    componentView: React.ReactNode;
}

export interface RenderGridItemOutput {
    hasRenderedComponent: boolean;
    componentView: React.ReactNode;
    shouldAffectGroupVisibility: boolean;
}

export interface RenderGridItemParams {
    gridItem: AvailGridItemVariants;
    schema: GridLayoutSchema;
    isRenderedFromComponentGridItem?: boolean;
}

export interface UseGeneratedComponent {
    onClose?: () => void;
}
