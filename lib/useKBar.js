"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKBar = void 0;
var React = __importStar(require("react"));
var KBarContextProvider_1 = require("./KBarContextProvider");
function useKBar(collector) {
    var _a = React.useContext(KBarContextProvider_1.KBarContext), query = _a.query, getState = _a.getState, subscribe = _a.subscribe, options = _a.options;
    var collected = React.useRef(collector === null || collector === void 0 ? void 0 : collector(getState()));
    var collectorRef = React.useRef(collector);
    var onCollect = React.useCallback(function (collected) { return (__assign(__assign({}, collected), { query: query, options: options })); }, [query, options]);
    var _b = React.useState(onCollect(collected.current)), render = _b[0], setRender = _b[1];
    React.useEffect(function () {
        var unsubscribe;
        if (collectorRef.current) {
            unsubscribe = subscribe(function (current) { return collectorRef.current(current); }, function (collected) { return setRender(onCollect(collected)); });
        }
        return function () {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [onCollect, subscribe]);
    return render;
}
exports.useKBar = useKBar;
