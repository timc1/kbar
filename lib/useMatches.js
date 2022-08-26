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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeepMatches = exports.useMatches = exports.NO_GROUP = void 0;
var React = __importStar(require("react"));
var useKBar_1 = require("./useKBar");
var utils_1 = require("./utils");
var command_score_1 = __importDefault(require("command-score"));
exports.NO_GROUP = {
    name: "none",
    priority: utils_1.Priority.NORMAL,
};
function order(a, b) {
    /**
     * Larger the priority = higher up the list
     */
    return b.priority - a.priority;
}
/**
 * returns deep matches only when a search query is present
 */
function useMatches() {
    var _a = (0, useKBar_1.useKBar)(function (state) { return ({
        search: state.searchQuery,
        actions: state.actions,
        rootActionId: state.currentRootActionId,
    }); }), search = _a.search, actions = _a.actions, rootActionId = _a.rootActionId;
    var rootResults = React.useMemo(function () {
        return Object.keys(actions)
            .reduce(function (acc, actionId) {
            var action = actions[actionId];
            if (!action.parent && !rootActionId) {
                acc.push(action);
            }
            if (action.id === rootActionId) {
                for (var i = 0; i < action.children.length; i++) {
                    acc.push(action.children[i]);
                }
            }
            return acc;
        }, [])
            .sort(order);
    }, [actions, rootActionId]);
    var getDeepResults = React.useCallback(function (actions) {
        var actionsClone = [];
        for (var i = 0; i < actions.length; i++) {
            actionsClone.push(actions[i]);
        }
        return (function collectChildren(actions, all) {
            if (all === void 0) { all = actionsClone; }
            for (var i = 0; i < actions.length; i++) {
                if (actions[i].children.length > 0) {
                    var childsChildren = actions[i].children;
                    for (var i_1 = 0; i_1 < childsChildren.length; i_1++) {
                        all.push(childsChildren[i_1]);
                    }
                    collectChildren(actions[i].children, all);
                }
            }
            return all;
        })(actions);
    }, []);
    var emptySearch = !search;
    var filtered = React.useMemo(function () {
        if (emptySearch)
            return rootResults;
        return getDeepResults(rootResults);
    }, [getDeepResults, rootResults, emptySearch]);
    var matches = useInternalMatches(filtered, search);
    var results = React.useMemo(function () {
        var _a, _b;
        /**
         * Store a reference to a section and it's list of actions.
         * Alongside these actions, we'll keep a temporary record of the
         * final priority calculated by taking the commandScore + the
         * explicitly set `action.priority` value.
         */
        var map = {};
        /**
         * Store another reference to a list of sections alongside
         * the section's final priority, calculated the same as above.
         */
        var list = [];
        /**
         * We'll take the list above and sort by its priority. Then we'll
         * collect all actions from the map above for this specific name and
         * sort by its priority as well.
         */
        var ordered = [];
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var action = match.action;
            var score = match.score || utils_1.Priority.NORMAL;
            var section = {
                name: typeof action.section === "string"
                    ? action.section
                    : ((_a = action.section) === null || _a === void 0 ? void 0 : _a.name) || exports.NO_GROUP.name,
                priority: typeof action.section === "string"
                    ? score
                    : ((_b = action.section) === null || _b === void 0 ? void 0 : _b.priority) || 0 + score,
            };
            if (!map[section.name]) {
                map[section.name] = [];
                list.push(section);
            }
            map[section.name].push({
                priority: action.priority + score,
                action: action,
            });
        }
        ordered = list.sort(order).map(function (group) { return ({
            name: group.name,
            actions: map[group.name].sort(order).map(function (item) { return item.action; }),
        }); });
        /**
         * Our final result is simply flattening the ordered list into
         * our familiar (ActionImpl | string)[] shape.
         */
        var results = [];
        for (var i = 0; i < ordered.length; i++) {
            var group = ordered[i];
            if (group.name !== exports.NO_GROUP.name)
                results.push(group.name);
            for (var i_2 = 0; i_2 < group.actions.length; i_2++) {
                results.push(group.actions[i_2]);
            }
        }
        return results;
    }, [matches]);
    // ensure that users have an accurate `currentRootActionId`
    // that syncs with the throttled return value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    var memoRootActionId = React.useMemo(function () { return rootActionId; }, [results]);
    return React.useMemo(function () { return ({
        results: results,
        rootActionId: memoRootActionId,
    }); }, [memoRootActionId, results]);
}
exports.useMatches = useMatches;
function useInternalMatches(filtered, search) {
    var value = React.useMemo(function () { return ({
        filtered: filtered,
        search: search,
    }); }, [filtered, search]);
    var _a = (0, utils_1.useThrottledValue)(value), throttledFiltered = _a.filtered, throttledSearch = _a.search;
    return React.useMemo(function () {
        if (throttledSearch.trim() === "") {
            return throttledFiltered.map(function (action) { return ({ score: 0, action: action }); });
        }
        var matches = [];
        for (var i = 0; i < throttledFiltered.length; i++) {
            var action = throttledFiltered[i];
            var score = (0, command_score_1.default)([action.name, action.keywords, action.subtitle].join(" "), throttledSearch);
            if (score > 0) {
                matches.push({ score: score, action: action });
            }
        }
        return matches;
    }, [throttledFiltered, throttledSearch]);
}
/**
 * @deprecated use useMatches
 */
exports.useDeepMatches = useMatches;
