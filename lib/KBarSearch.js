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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBarSearch = exports.getListboxItemId = exports.KBAR_LISTBOX = void 0;
var React = __importStar(require("react"));
var types_1 = require("./types");
var useKBar_1 = require("./useKBar");
exports.KBAR_LISTBOX = "kbar-listbox";
var getListboxItemId = function (id) { return "kbar-listbox-item-" + id; };
exports.getListboxItemId = getListboxItemId;
function KBarSearch(props) {
    var _a = (0, useKBar_1.useKBar)(function (state) { return ({
        search: state.searchQuery,
        currentRootActionId: state.currentRootActionId,
        actions: state.actions,
        activeIndex: state.activeIndex,
        showing: state.visualState === types_1.VisualState.showing,
    }); }), query = _a.query, search = _a.search, actions = _a.actions, currentRootActionId = _a.currentRootActionId, activeIndex = _a.activeIndex, showing = _a.showing, options = _a.options;
    var ownRef = React.useRef(null);
    var defaultPlaceholder = props.defaultPlaceholder, rest = __rest(props, ["defaultPlaceholder"]);
    React.useEffect(function () {
        query.setSearch("");
        ownRef.current.focus();
        return function () { return query.setSearch(""); };
    }, [currentRootActionId, query]);
    var placeholder = React.useMemo(function () {
        var defaultText = defaultPlaceholder !== null && defaultPlaceholder !== void 0 ? defaultPlaceholder : "Type a command or search…";
        return currentRootActionId && actions[currentRootActionId]
            ? actions[currentRootActionId].name
            : defaultText;
    }, [actions, currentRootActionId, defaultPlaceholder]);
    return (React.createElement("input", __assign({}, rest, { ref: ownRef, autoFocus: true, autoComplete: "off", role: "combobox", spellCheck: "false", "aria-expanded": showing, "aria-controls": exports.KBAR_LISTBOX, "aria-activedescendant": (0, exports.getListboxItemId)(activeIndex), value: search, placeholder: placeholder, onChange: function (event) {
            var _a, _b, _c;
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, event);
            query.setSearch(event.target.value);
            (_c = (_b = options === null || options === void 0 ? void 0 : options.callbacks) === null || _b === void 0 ? void 0 : _b.onQueryChange) === null || _c === void 0 ? void 0 : _c.call(_b, event.target.value);
        }, onKeyDown: function (event) {
            var _a;
            (_a = props.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(props, event);
            if (currentRootActionId && !search && event.key === "Backspace") {
                var parent_1 = actions[currentRootActionId].parent;
                query.setCurrentRootAction(parent_1);
            }
        } })));
}
exports.KBarSearch = KBarSearch;
