import type { ActionId, Action, History } from "../types";
import { ActionImpl } from "./ActionImpl";
interface ActionInterfaceOptions {
    historyManager?: History;
}
export declare class ActionInterface {
    actions: Record<ActionId, ActionImpl>;
    options: ActionInterfaceOptions;
    constructor(actions?: Action[], options?: ActionInterfaceOptions);
    add(actions: Action[]): {
        [x: string]: ActionImpl;
    };
    remove(actions: Action[]): {
        [x: string]: ActionImpl;
    };
}
export {};
