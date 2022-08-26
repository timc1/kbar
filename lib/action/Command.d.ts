import type { History } from "../types";
interface CommandOptions {
    history?: History;
}
export declare class Command {
    perform: (...args: any) => any;
    private historyItem?;
    history?: {
        undo: History["undo"];
        redo: History["redo"];
    };
    constructor(command: {
        perform: Command["perform"];
    }, options?: CommandOptions);
}
export {};
