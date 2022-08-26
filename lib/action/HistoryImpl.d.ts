import type { History, HistoryItem } from "../types";
export declare class HistoryItemImpl implements HistoryItem {
    perform: HistoryItem["perform"];
    negate: HistoryItem["negate"];
    constructor(item: HistoryItem);
    static create(item: HistoryItem): HistoryItemImpl;
}
declare class HistoryImpl implements History {
    static instance: HistoryImpl;
    undoStack: HistoryItemImpl[];
    redoStack: HistoryItemImpl[];
    constructor();
    init(): void;
    add(item: HistoryItem): HistoryItemImpl;
    remove(item: HistoryItem): void;
    undo(item?: HistoryItem): HistoryItemImpl | undefined;
    redo(item?: HistoryItem): HistoryItemImpl | undefined;
    reset(): void;
}
declare const history: HistoryImpl;
export { history };
