import type { KBarOptions, KBarQuery, KBarState } from "./types";
interface BaseKBarReturnType {
    query: KBarQuery;
    options: KBarOptions;
}
declare type useKBarReturnType<S = null> = S extends null ? BaseKBarReturnType : S & BaseKBarReturnType;
export declare function useKBar<C = null>(collector?: (state: KBarState) => C): useKBarReturnType<C>;
export {};
