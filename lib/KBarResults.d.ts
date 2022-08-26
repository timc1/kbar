import * as React from "react";
import { ActionImpl } from "./action/ActionImpl";
interface RenderParams<T = ActionImpl | string> {
    item: T;
    active: boolean;
}
interface KBarResultsProps {
    items: any[];
    onRender: (params: RenderParams) => React.ReactElement;
    maxHeight?: number;
}
export declare const KBarResults: React.FC<KBarResultsProps>;
export {};
