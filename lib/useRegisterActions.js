"use strict";
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
exports.useRegisterActions = void 0;
var React = __importStar(require("react"));
var useKBar_1 = require("./useKBar");
function useRegisterActions(actions, dependencies) {
    if (dependencies === void 0) { dependencies = []; }
    var query = (0, useKBar_1.useKBar)().query;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var actionsCache = React.useMemo(function () { return actions; }, dependencies);
    React.useEffect(function () {
        if (!actionsCache.length) {
            return;
        }
        var unregister = query.registerActions(actionsCache);
        return function () {
            unregister();
        };
    }, [query, actionsCache]);
}
exports.useRegisterActions = useRegisterActions;
