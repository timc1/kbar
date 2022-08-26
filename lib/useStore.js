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
exports.useStore = void 0;
var fast_equals_1 = require("fast-equals");
var React = __importStar(require("react"));
var ActionInterface_1 = require("./action/ActionInterface");
var HistoryImpl_1 = require("./action/HistoryImpl");
var types_1 = require("./types");
function useStore(props) {
    var optionsRef = React.useRef(__assign({ animations: {
            enterMs: 200,
            exitMs: 100,
        } }, props.options));
    var actionsInterface = React.useMemo(function () {
        return new ActionInterface_1.ActionInterface(props.actions || [], {
            historyManager: optionsRef.current.enableHistory ? HistoryImpl_1.history : undefined,
        });
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    // TODO: at this point useReducer might be a better approach to managing state.
    var _a = React.useState({
        searchQuery: "",
        currentRootActionId: null,
        visualState: types_1.VisualState.hidden,
        actions: __assign({}, actionsInterface.actions),
        activeIndex: 0,
    }), state = _a[0], setState = _a[1];
    var currState = React.useRef(state);
    currState.current = state;
    var getState = React.useCallback(function () { return currState.current; }, []);
    var publisher = React.useMemo(function () { return new Publisher(getState); }, [getState]);
    React.useEffect(function () {
        currState.current = state;
        publisher.notify();
    }, [state, publisher]);
    var registerActions = React.useCallback(function (actions) {
        setState(function (state) {
            return __assign(__assign({}, state), { actions: actionsInterface.add(actions) });
        });
        return function unregister() {
            setState(function (state) {
                return __assign(__assign({}, state), { actions: actionsInterface.remove(actions) });
            });
        };
    }, [actionsInterface]);
    return React.useMemo(function () {
        return {
            getState: getState,
            query: {
                setCurrentRootAction: function (actionId) {
                    setState(function (state) { return (__assign(__assign({}, state), { currentRootActionId: actionId })); });
                },
                setVisualState: function (cb) {
                    setState(function (state) { return (__assign(__assign({}, state), { visualState: typeof cb === "function" ? cb(state.visualState) : cb })); });
                },
                setSearch: function (searchQuery) {
                    return setState(function (state) { return (__assign(__assign({}, state), { searchQuery: searchQuery })); });
                },
                registerActions: registerActions,
                toggle: function () {
                    return setState(function (state) { return (__assign(__assign({}, state), { visualState: [
                            types_1.VisualState.animatingOut,
                            types_1.VisualState.hidden,
                        ].includes(state.visualState)
                            ? types_1.VisualState.animatingIn
                            : types_1.VisualState.animatingOut })); });
                },
                setActiveIndex: function (cb) {
                    return setState(function (state) { return (__assign(__assign({}, state), { activeIndex: typeof cb === "number" ? cb : cb(state.activeIndex) })); });
                },
            },
            options: optionsRef.current,
            subscribe: function (collector, cb) { return publisher.subscribe(collector, cb); },
        };
    }, [getState, publisher, registerActions]);
}
exports.useStore = useStore;
var Publisher = /** @class */ (function () {
    function Publisher(getState) {
        this.subscribers = [];
        this.getState = getState;
    }
    Publisher.prototype.subscribe = function (collector, onChange) {
        var _this = this;
        var subscriber = new Subscriber(function () { return collector(_this.getState()); }, onChange);
        this.subscribers.push(subscriber);
        return this.unsubscribe.bind(this, subscriber);
    };
    Publisher.prototype.unsubscribe = function (subscriber) {
        if (this.subscribers.length) {
            var index = this.subscribers.indexOf(subscriber);
            if (index > -1) {
                return this.subscribers.splice(index, 1);
            }
        }
    };
    Publisher.prototype.notify = function () {
        this.subscribers.forEach(function (subscriber) { return subscriber.collect(); });
    };
    return Publisher;
}());
var Subscriber = /** @class */ (function () {
    function Subscriber(collector, onChange) {
        this.collector = collector;
        this.onChange = onChange;
    }
    Subscriber.prototype.collect = function () {
        try {
            // grab latest state
            var recollect = this.collector();
            if (!(0, fast_equals_1.deepEqual)(recollect, this.collected)) {
                this.collected = recollect;
                if (this.onChange) {
                    this.onChange(this.collected);
                }
            }
        }
        catch (error) {
            console.warn(error);
        }
    };
    return Subscriber;
}());
