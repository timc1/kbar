"use strict";
// Fixes special character issues; `?` -> `shift+/` + build issue
// https://github.com/jamiebuilds/tinykeys
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * These are the modifier keys that change the meaning of keybindings.
 *
 * Note: Ignoring "AltGraph" because it is covered by the others.
 */
var KEYBINDING_MODIFIER_KEYS = ["Shift", "Meta", "Alt", "Control"];
/**
 * Keybinding sequences should timeout if individual key presses are more than
 * 1s apart by default.
 */
var DEFAULT_TIMEOUT = 1000;
/**
 * Keybinding sequences should bind to this event by default.
 */
var DEFAULT_EVENT = "keydown";
/**
 * An alias for creating platform-specific keybinding aliases.
 */
var MOD = typeof navigator === "object" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ? "Meta"
    : "Control";
/**
 * There's a bug in Chrome that causes event.getModifierState not to exist on
 * KeyboardEvent's for F1/F2/etc keys.
 */
function getModifierState(event, mod) {
    return typeof event.getModifierState === "function"
        ? event.getModifierState(mod)
        : false;
}
/**
 * Parses a "Key Binding String" into its parts
 *
 * grammar    = `<sequence>`
 * <sequence> = `<press> <press> <press> ...`
 * <press>    = `<key>` or `<mods>+<key>`
 * <mods>     = `<mod>+<mod>+...`
 */
function parse(str) {
    return str
        .trim()
        .split(" ")
        .map(function (press) {
        var mods = press.split(/\b\+/);
        var key = mods.pop();
        mods = mods.map(function (mod) { return (mod === "$mod" ? MOD : mod); });
        return [mods, key];
    });
}
/**
 * This tells us if a series of events matches a key binding sequence either
 * partially or exactly.
 */
function match(event, press) {
    // Special characters; `?` `!`
    if (/^[^A-Za-z0-9]$/.test(event.key) && press[1] === event.key) {
        return true;
    }
    // prettier-ignore
    return !(
    // Allow either the `event.key` or the `event.code`
    // MDN event.key: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    // MDN event.code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
    (press[1].toUpperCase() !== event.key.toUpperCase() &&
        press[1] !== event.code) ||
        // Ensure all the modifiers in the keybinding are pressed.
        press[0].find(function (mod) {
            return !getModifierState(event, mod);
        }) ||
        // KEYBINDING_MODIFIER_KEYS (Shift/Control/etc) change the meaning of a
        // keybinding. So if they are pressed but aren't part of the current
        // keybinding press, then we don't have a match.
        KEYBINDING_MODIFIER_KEYS.find(function (mod) {
            return !press[0].includes(mod) && press[1] !== mod && getModifierState(event, mod);
        }));
}
/**
 * Subscribes to keybindings.
 *
 * Returns an unsubscribe method.
 *
 * @example
 * ```js
 * import keybindings from "../src/keybindings"
 *
 * keybindings(window, {
 * 	"Shift+d": () => {
 * 		alert("The 'Shift' and 'd' keys were pressed at the same time")
 * 	},
 * 	"y e e t": () => {
 * 		alert("The keys 'y', 'e', 'e', and 't' were pressed in order")
 * 	},
 * 	"$mod+d": () => {
 * 		alert("Either 'Control+d' or 'Meta+d' were pressed")
 * 	},
 * })
 * ```
 */
function keybindings(target, keyBindingMap, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    var timeout = (_a = options.timeout) !== null && _a !== void 0 ? _a : DEFAULT_TIMEOUT;
    var event = (_b = options.event) !== null && _b !== void 0 ? _b : DEFAULT_EVENT;
    var keyBindings = Object.keys(keyBindingMap).map(function (key) {
        return [parse(key), keyBindingMap[key]];
    });
    var possibleMatches = new Map();
    var timer = null;
    var onKeyEvent = function (event) {
        // Ensure and stop any event that isn't a full keyboard event.
        // Autocomplete option navigation and selection would fire a instanceof Event,
        // instead of the expected KeyboardEvent
        if (!(event instanceof KeyboardEvent)) {
            return;
        }
        keyBindings.forEach(function (keyBinding) {
            var sequence = keyBinding[0];
            var callback = keyBinding[1];
            var prev = possibleMatches.get(sequence);
            var remainingExpectedPresses = prev ? prev : sequence;
            var currentExpectedPress = remainingExpectedPresses[0];
            var matches = match(event, currentExpectedPress);
            if (!matches) {
                // Modifier keydown events shouldn't break sequences
                // Note: This works because:
                // - non-modifiers will always return false
                // - if the current keypress is a modifier then it will return true when we check its state
                // MDN: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
                if (!getModifierState(event, event.key)) {
                    possibleMatches.delete(sequence);
                }
            }
            else if (remainingExpectedPresses.length > 1) {
                possibleMatches.set(sequence, remainingExpectedPresses.slice(1));
            }
            else {
                possibleMatches.delete(sequence);
                callback(event);
            }
        });
        if (timer) {
            clearTimeout(timer);
        }
        // @ts-ignore
        timer = setTimeout(possibleMatches.clear.bind(possibleMatches), timeout);
    };
    target.addEventListener(event, onKeyEvent);
    return function () {
        target.removeEventListener(event, onKeyEvent);
    };
}
exports.default = keybindings;
