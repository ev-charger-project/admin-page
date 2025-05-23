export interface ShouldNavigateItem {
    id: string;
    shouldNavigate: boolean;
}

export interface RouterState {
    shouldNavigates: ShouldNavigateItem[];
}

export type PageMode = "view" | "edit" | "add";

export type ModalMode = "edit" | "view";
