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
exports.KBarResults = void 0;
var React = __importStar(require("react"));
var react_virtual_1 = require("react-virtual");
var KBarSearch_1 = require("./KBarSearch");
var useKBar_1 = require("./useKBar");
var utils_1 = require("./utils");
var START_INDEX = 0;
var KBarResults = function (props) {
    var activeRef = React.useRef(null);
    var parentRef = React.useRef(null);
    // store a ref to all items so we do not have to pass
    // them as a dependency when setting up event listeners.
    var itemsRef = React.useRef(props.items);
    itemsRef.current = props.items;
    var rowVirtualizer = (0, react_virtual_1.useVirtual)({
        size: itemsRef.current.length,
        parentRef: parentRef,
    });
    var _a = (0, useKBar_1.useKBar)(function (state) { return ({
        search: state.searchQuery,
        currentRootActionId: state.currentRootActionId,
        activeIndex: state.activeIndex,
    }); }), query = _a.query, search = _a.search, currentRootActionId = _a.currentRootActionId, activeIndex = _a.activeIndex, options = _a.options;
    React.useEffect(function () {
        var handler = function (event) {
            var _a;
            if (event.key === "ArrowUp" || (event.ctrlKey && event.key === "p")) {
                event.preventDefault();
                query.setActiveIndex(function (index) {
                    var nextIndex = index > START_INDEX ? index - 1 : index;
                    // avoid setting active index on a group
                    if (typeof itemsRef.current[nextIndex] === "string") {
                        if (nextIndex === 0)
                            return index;
                        nextIndex -= 1;
                    }
                    return nextIndex;
                });
            }
            else if (event.key === "ArrowDown" ||
                (event.ctrlKey && event.key === "n")) {
                event.preventDefault();
                query.setActiveIndex(function (index) {
                    var nextIndex = index < itemsRef.current.length - 1 ? index + 1 : index;
                    // avoid setting active index on a group
                    if (typeof itemsRef.current[nextIndex] === "string") {
                        if (nextIndex === itemsRef.current.length - 1)
                            return index;
                        nextIndex += 1;
                    }
                    return nextIndex;
                });
            }
            else if (event.key === "Enter") {
                event.preventDefault();
                // storing the active dom element in a ref prevents us from
                // having to calculate the current action to perform based
                // on the `activeIndex`, which we would have needed to add
                // as part of the dependencies array.
                (_a = activeRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }
        };
        window.addEventListener("keydown", handler);
        return function () { return window.removeEventListener("keydown", handler); };
    }, [query]);
    // destructuring here to prevent linter warning to pass
    // entire rowVirtualizer in the dependencies array.
    var scrollToIndex = rowVirtualizer.scrollToIndex;
    React.useEffect(function () {
        scrollToIndex(activeIndex, {
            // ensure that if the first item in the list is a group
            // name and we are focused on the second item, to not
            // scroll past that group, hiding it.
            align: activeIndex <= 1 ? "end" : "auto",
        });
    }, [activeIndex, scrollToIndex]);
    React.useEffect(function () {
        // TODO(tim): fix scenario where async actions load in
        // and active index is reset to the first item. i.e. when
        // users register actions and bust the `useRegisterActions`
        // cache, we won't want to reset their active index as they
        // are navigating the list.
        query.setActiveIndex(
        // avoid setting active index on a group
        typeof props.items[START_INDEX] === "string"
            ? START_INDEX + 1
            : START_INDEX);
    }, [search, currentRootActionId, props.items, query]);
    var execute = React.useCallback(function (item) {
        var _a, _b;
        if (typeof item === "string")
            return;
        if (item.command) {
            item.command.perform(item);
            query.toggle();
        }
        else {
            query.setSearch("");
            query.setCurrentRootAction(item.id);
        }
        (_b = (_a = options.callbacks) === null || _a === void 0 ? void 0 : _a.onSelectAction) === null || _b === void 0 ? void 0 : _b.call(_a, item);
    }, [query, options]);
    var pointerMoved = (0, utils_1.usePointerMovedSinceMount)();
    return (React.createElement("div", { ref: parentRef, style: {
            maxHeight: props.maxHeight || 400,
            position: "relative",
            overflow: "auto",
        } },
        React.createElement("div", { role: "listbox", id: KBarSearch_1.KBAR_LISTBOX, style: {
                height: rowVirtualizer.totalSize + "px",
                width: "100%",
            } }, rowVirtualizer.virtualItems.map(function (virtualRow) {
            var item = itemsRef.current[virtualRow.index];
            var handlers = typeof item !== "string" && {
                onPointerMove: function () {
                    return pointerMoved &&
                        activeIndex !== virtualRow.index &&
                        query.setActiveIndex(virtualRow.index);
                },
                onPointerDown: function () { return query.setActiveIndex(virtualRow.index); },
                onClick: function () { return execute(item); },
            };
            var active = virtualRow.index === activeIndex;
            return (React.createElement("div", __assign({ ref: active ? activeRef : null, id: (0, KBarSearch_1.getListboxItemId)(virtualRow.index), role: "option", "aria-selected": active, key: virtualRow.index, style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: "translateY(" + virtualRow.start + "px)",
                } }, handlers), React.cloneElement(props.onRender({
                item: item,
                active: active,
            }), {
                ref: virtualRow.measureRef,
            })));
        }))));
};
exports.KBarResults = KBarResults;
