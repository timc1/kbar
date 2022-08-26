import type { ActionImpl } from "./action/ActionImpl";
export declare const NO_GROUP: {
    name: string;
    priority: number;
};
/**
 * returns deep matches only when a search query is present
 */
export declare function useMatches(): {
    results: (string | ActionImpl)[];
    rootActionId: string | null | undefined;
};
/**
 * @deprecated use useMatches
 */
export declare const useDeepMatches: typeof useMatches;
