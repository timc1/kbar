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
exports.KBarAnimator = void 0;
var React = __importStar(require("react"));
var types_1 = require("./types");
var useKBar_1 = require("./useKBar");
var utils_1 = require("./utils");
var appearanceAnimationKeyframes = [
    {
        opacity: 0,
        transform: "scale(.99)",
    },
    { opacity: 1, transform: "scale(1.01)" },
    { opacity: 1, transform: "scale(1)" },
];
var bumpAnimationKeyframes = [
    {
        transform: "scale(1)",
    },
    {
        transform: "scale(.98)",
    },
    {
        transform: "scale(1)",
    },
];
var KBarAnimator = function (_a) {
    var _b, _c;
    var children = _a.children, style = _a.style, className = _a.className;
    var _d = (0, useKBar_1.useKBar)(function (state) { return ({
        visualState: state.visualState,
        currentRootActionId: state.currentRootActionId,
    }); }), visualState = _d.visualState, currentRootActionId = _d.currentRootActionId, query = _d.query, options = _d.options;
    var outerRef = React.useRef(null);
    var innerRef = React.useRef(null);
    var enterMs = ((_b = options === null || options === void 0 ? void 0 : options.animations) === null || _b === void 0 ? void 0 : _b.enterMs) || 0;
    var exitMs = ((_c = options === null || options === void 0 ? void 0 : options.animations) === null || _c === void 0 ? void 0 : _c.exitMs) || 0;
    // Show/hide animation
    React.useEffect(function () {
        if (visualState === types_1.VisualState.showing) {
            return;
        }
        var duration = visualState === types_1.VisualState.animatingIn ? enterMs : exitMs;
        var element = outerRef.current;
        element === null || element === void 0 ? void 0 : element.animate(appearanceAnimationKeyframes, {
            duration: duration,
            easing: 
            // TODO: expose easing in options
            visualState === types_1.VisualState.animatingOut ? "ease-in" : "ease-out",
            direction: visualState === types_1.VisualState.animatingOut ? "reverse" : "normal",
            fill: "forwards",
        });
    }, [options, visualState, enterMs, exitMs]);
    // Height animation
    var previousHeight = React.useRef();
    React.useEffect(function () {
        // Only animate if we're actually showing
        if (visualState === types_1.VisualState.showing) {
            var outer_1 = outerRef.current;
            var inner_1 = innerRef.current;
            if (!outer_1 || !inner_1) {
                return;
            }
            var ro_1 = new ResizeObserver(function (entries) {
                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                    var entry = entries_1[_i];
                    var cr = entry.contentRect;
                    if (!previousHeight.current) {
                        previousHeight.current = cr.height;
                    }
                    outer_1.animate([
                        {
                            height: previousHeight.current + "px",
                        },
                        {
                            height: cr.height + "px",
                        },
                    ], {
                        duration: enterMs / 2,
                        // TODO: expose configs here
                        easing: "ease-out",
                        fill: "forwards",
                    });
                    previousHeight.current = cr.height;
                }
            });
            ro_1.observe(inner_1);
            return function () {
                ro_1.unobserve(inner_1);
            };
        }
    }, [visualState, options, enterMs, exitMs]);
    // Bump animation between nested actions
    var firstRender = React.useRef(true);
    React.useEffect(function () {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        var element = outerRef.current;
        if (element) {
            element.animate(bumpAnimationKeyframes, {
                duration: enterMs,
                easing: "ease-out",
            });
        }
    }, [currentRootActionId, enterMs]);
    (0, utils_1.useOuterClick)(outerRef, function () {
        var _a, _b;
        query.setVisualState(types_1.VisualState.animatingOut);
        (_b = (_a = options.callbacks) === null || _a === void 0 ? void 0 : _a.onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
    });
    return (React.createElement("div", { ref: outerRef, style: __assign(__assign(__assign({}, appearanceAnimationKeyframes[0]), style), { pointerEvents: "auto" }), className: className },
        React.createElement("div", { ref: innerRef }, children)));
};
exports.KBarAnimator = KBarAnimator;
