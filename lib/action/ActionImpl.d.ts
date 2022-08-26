import { Command } from "./Command";
import type { Action, ActionStore, History } from "../types";
interface ActionImplOptions {
    store: ActionStore;
    ancestors?: ActionImpl[];
    history?: History;
}
export declare class ActionImpl implements Action {
    id: Action["id"];
    name: Action["name"];
    shortcut: Action["shortcut"];
    keywords: Action["keywords"];
    section: Action["section"];
    icon: Action["icon"];
    subtitle: Action["subtitle"];
    parent?: Action["parent"];
    /**
     * @deprecated use action.command.perform
     */
    perform: Action["perform"];
    priority: number;
    command?: Command;
    ancestors: ActionImpl[];
    children: ActionImpl[];
    constructor(action: Action, options: ActionImplOptions);
    addChild(childActionImpl: ActionImpl): void;
    removeChild(actionImpl: ActionImpl): void;
    get parentActionImpl(): ActionImpl;
    static create(action: Action, options: ActionImplOptions): ActionImpl;
}
export {};
