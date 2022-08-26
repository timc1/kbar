import * as React from "react";
import type { Action } from "./types";
export declare function swallowEvent(event: any): void;
export declare function useOuterClick(dom: React.RefObject<HTMLElement>, cb: () => void): void;
export declare function usePointerMovedSinceMount(): boolean;
export declare function randomId(): string;
export declare function createAction(params: Omit<Action, "id">): Action;
export declare function noop(): void;
export declare const useIsomorphicLayout: typeof React.useLayoutEffect;
export declare function getScrollbarWidth(): number;
export declare function useThrottledValue<T = any>(value: T, ms?: number): T;
export declare function shouldRejectKeystrokes({ ignoreWhenFocused, }?: {
    ignoreWhenFocused: string[];
}): boolean | null;
export declare function isModKey(event: KeyboardEvent | MouseEvent | React.KeyboardEvent): boolean;
export declare const Priority: {
    HIGH: number;
    NORMAL: number;
    LOW: number;
};
