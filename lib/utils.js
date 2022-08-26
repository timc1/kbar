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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = exports.isModKey = exports.shouldRejectKeystrokes = exports.useThrottledValue = exports.getScrollbarWidth = exports.useIsomorphicLayout = exports.noop = exports.createAction = exports.randomId = exports.usePointerMovedSinceMount = exports.useOuterClick = exports.swallowEvent = void 0;
var React = __importStar(require("react"));
function swallowEvent(event) {
    event.stopPropagation();
    event.preventDefault();
}
exports.swallowEvent = swallowEvent;
function useOuterClick(dom, cb) {
    var cbRef = React.useRef(cb);
    cbRef.current = cb;
    React.useEffect(function () {
        function handler(event) {
            var _a, _b;
            if (((_a = dom.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)) ||
                // Add support for ReactShadowRoot
                // @ts-expect-error wrong types, the `host` property exists https://stackoverflow.com/a/25340456
                event.target === ((_b = dom.current) === null || _b === void 0 ? void 0 : _b.getRootNode().host)) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            cbRef.current();
        }
        window.addEventListener("pointerdown", handler, true);
        return function () { return window.removeEventListener("pointerdown", handler, true); };
    }, [dom]);
}
exports.useOuterClick = useOuterClick;
function usePointerMovedSinceMount() {
    var _a = React.useState(false), moved = _a[0], setMoved = _a[1];
    React.useEffect(function () {
        function handler() {
            setMoved(true);
        }
        if (!moved) {
            window.addEventListener("pointermove", handler);
            return function () { return window.removeEventListener("pointermove", handler); };
        }
    }, [moved]);
    return moved;
}
exports.usePointerMovedSinceMount = usePointerMovedSinceMount;
function randomId() {
    return Math.random().toString(36).substring(2, 9);
}
exports.randomId = randomId;
function createAction(params) {
    return __assign({ id: randomId() }, params);
}
exports.createAction = createAction;
function noop() { }
exports.noop = noop;
exports.useIsomorphicLayout = typeof window === "undefined" ? noop : React.useLayoutEffect;
// https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    document.body.appendChild(outer);
    var inner = document.createElement("div");
    outer.appendChild(inner);
    var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
}
exports.getScrollbarWidth = getScrollbarWidth;
function useThrottledValue(value, ms) {
    if (ms === void 0) { ms = 100; }
    var _a = React.useState(value), throttledValue = _a[0], setThrottledValue = _a[1];
    var lastRan = React.useRef(Date.now());
    React.useEffect(function () {
        if (ms === 0)
            return;
        var timeout = setTimeout(function () {
            setThrottledValue(value);
            lastRan.current = Date.now();
        }, lastRan.current - (Date.now() - ms));
        return function () {
            clearTimeout(timeout);
        };
    }, [ms, value]);
    return ms === 0 ? value : throttledValue;
}
exports.useThrottledValue = useThrottledValue;
function shouldRejectKeystrokes(_a) {
    var _b, _c;
    var _d = _a === void 0 ? { ignoreWhenFocused: [] } : _a, ignoreWhenFocused = _d.ignoreWhenFocused;
    var inputs = __spreadArray(["input", "textarea"], ignoreWhenFocused, true).map(function (el) {
        return el.toLowerCase();
    });
    var activeElement = document.activeElement;
    var ignoreStrokes = activeElement &&
        (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
            ((_b = activeElement.attributes.getNamedItem("role")) === null || _b === void 0 ? void 0 : _b.value) === "textbox" ||
            ((_c = activeElement.attributes.getNamedItem("contenteditable")) === null || _c === void 0 ? void 0 : _c.value) ===
                "true");
    return ignoreStrokes;
}
exports.shouldRejectKeystrokes = shouldRejectKeystrokes;
var SSR = typeof window === "undefined";
var isMac = !SSR && window.navigator.platform === "MacIntel";
function isModKey(event) {
    return isMac ? event.metaKey : event.ctrlKey;
}
exports.isModKey = isModKey;
exports.Priority = {
    HIGH: 1,
    NORMAL: 0,
    LOW: -1,
};
