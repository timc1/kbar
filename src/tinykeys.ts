/**
 * A single press of a keybinding sequence
 */
export type KeyBindingPress = [mods: string[], key: string | RegExp];

/**
 * A map of keybinding strings to event handlers.
 */
export interface KeyBindingMap {
  [keybinding: string]: (event: KeyboardEvent) => void;
}

export interface KeyBindingHandlerOptions {
  /**
   * Keybinding sequences will wait this long between key presses before
   * cancelling (default: 1000).
   *
   * **Note:** Setting this value too low (i.e. `300`) will be too fast for many
   * of your users.
   */
  timeout?: number;
}

/**
 * Options to configure the behavior of keybindings.
 */
export interface KeyBindingOptions extends KeyBindingHandlerOptions {
  /**
   * Key presses will listen to this event (default: "keydown").
   */
  event?: "keydown" | "keyup";

  /**
   * Key presses will use a capture listener (default: false)
   */
  capture?: boolean;
}

/**
 * These are the modifier keys that change the meaning of keybindings.
 *
 * Note: Ignoring "AltGraph" because it is covered by the others.
 */
let KEYBINDING_MODIFIER_KEYS = ["Shift", "Meta", "Alt", "Control"];

/**
 * Keybinding sequences should timeout if individual key presses are more than
 * 1s apart by default.
 */
let DEFAULT_TIMEOUT = 1000;

/**
 * Keybinding sequences should bind to this event by default.
 */
let DEFAULT_EVENT = "keydown" as const;

/**
 * Platform detection code.
 * @see https://github.com/jamiebuilds/tinykeys/issues/184
 */
let PLATFORM = typeof navigator === "object" ? navigator.platform : "";
let APPLE_DEVICE = /Mac|iPod|iPhone|iPad/.test(PLATFORM);

/**
 * An alias for creating platform-specific keybinding aliases.
 */
let MOD = APPLE_DEVICE ? "Meta" : "Control";

/**
 * Meaning of `AltGraph`, from MDN:
 * - Windows: Both Alt and Ctrl keys are pressed, or AltGr key is pressed
 * - Mac: ⌥ Option key pressed
 * - Linux: Level 3 Shift key (or Level 5 Shift key) pressed
 * - Android: Not supported
 * @see https://github.com/jamiebuilds/tinykeys/issues/185
 */
let ALT_GRAPH_ALIASES =
  PLATFORM === "Win32" ? ["Control", "Alt"] : APPLE_DEVICE ? ["Alt"] : [];

/**
 * There's a bug in Chrome that causes event.getModifierState not to exist on
 * KeyboardEvent's for F1/F2/etc keys.
 */
function getModifierState(event: KeyboardEvent, mod: string) {
  return typeof event.getModifierState === "function"
    ? event.getModifierState(mod) ||
        (ALT_GRAPH_ALIASES.includes(mod) && event.getModifierState("AltGraph"))
    : false;
}

/**
 * Parses a "Key Binding String" into its parts
 *
 * grammar    = `<sequence>`
 * <sequence> = `<press> <press> <press> ...`
 * <press>    = `<key>` or `<mods>+<key>`
 * <mods>     = `<mod>+<mod>+...`
 * <key>      = `<KeyboardEvent.key>` or `<KeyboardEvent.code>` (case-insensitive)
 * <key>      = `(<regex>)` -> `/^<regex>$/` (case-sensitive)
 */
export function parseKeybinding(str: string): KeyBindingPress[] {
  return str
    .trim()
    .split(" ")
    .map((press) => {
      let mods = press.split(/\b\+/);
      let key: string | RegExp = mods.pop() as string;
      let match = key.match(/^\((.+)\)$/);
      if (match) {
        key = new RegExp(`^${match[1]}$`);
      }
      mods = mods.map((mod) => (mod === "$mod" ? MOD : mod));
      return [mods, key];
    });
}

/**
 * This tells us if a single keyboard event matches a single keybinding press.
 */
export function matchKeyBindingPress(
  event: KeyboardEvent,
  [mods, key]: KeyBindingPress
): boolean {
  // prettier-ignore
  return !(
		// Allow either the `event.key` or the `event.code`
		// MDN event.key: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
		// MDN event.code: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
		(
			key instanceof RegExp ? !(key.test(event.key) || key.test(event.code)) :
			(key.toUpperCase() !== event.key.toUpperCase() &&
			key !== event.code)
		) ||

		// Ensure all the modifiers in the keybinding are pressed.
		mods.find(mod => {
			return !getModifierState(event, mod)
		}) ||

		// KEYBINDING_MODIFIER_KEYS (Shift/Control/etc) change the meaning of a
		// keybinding. So if they are pressed but aren't part of the current
		// keybinding press, then we don't have a match.
		KEYBINDING_MODIFIER_KEYS.find(mod => {
			return !mods.includes(mod) && key !== mod && getModifierState(event, mod)
		})
	)
}

/**
 * Creates an event listener for handling keybindings.
 *
 * @example
 * ```js
 * import { createKeybindingsHandler } from "../src/keybindings"
 *
 * let handler = createKeybindingsHandler({
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
 *
 * window.addEvenListener("keydown", handler)
 * ```
 */
export function createKeybindingsHandler(
  keyBindingMap: KeyBindingMap,
  options: KeyBindingHandlerOptions = {}
): EventListener {
  let timeout = options.timeout ?? DEFAULT_TIMEOUT;

  let keyBindings = Object.keys(keyBindingMap).map((key) => {
    return [parseKeybinding(key), keyBindingMap[key]] as const;
  });

  let possibleMatches = new Map<KeyBindingPress[], KeyBindingPress[]>();
  let timer: number | null = null;

  return (event) => {
    // Ensure and stop any event that isn't a full keyboard event.
    // Autocomplete option navigation and selection would fire a instanceof Event,
    // instead of the expected KeyboardEvent
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    keyBindings.forEach((keyBinding) => {
      let sequence = keyBinding[0];
      let callback = keyBinding[1];

      let prev = possibleMatches.get(sequence);
      let remainingExpectedPresses = prev ? prev : sequence;
      let currentExpectedPress = remainingExpectedPresses[0];

      let matches = matchKeyBindingPress(event, currentExpectedPress);

      if (!matches) {
        // Modifier keydown events shouldn't break sequences
        // Note: This works because:
        // - non-modifiers will always return false
        // - if the current keypress is a modifier then it will return true when we check its state
        // MDN: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
        if (!getModifierState(event, event.key)) {
          possibleMatches.delete(sequence);
        }
      } else if (remainingExpectedPresses.length > 1) {
        possibleMatches.set(sequence, remainingExpectedPresses.slice(1));
      } else {
        possibleMatches.delete(sequence);
        callback(event);
      }
    });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(possibleMatches.clear.bind(possibleMatches), timeout);
  };
}

/**
 * Subscribes to keybindings.
 *
 * Returns an unsubscribe method.
 *
 * @example
 * ```js
 * import { tinykeys } from "../src/tinykeys"
 *
 * tinykeys(window, {
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
export function tinykeys(
  target: Window | HTMLElement,
  keyBindingMap: KeyBindingMap,
  { event = DEFAULT_EVENT, capture, timeout }: KeyBindingOptions = {}
): () => void {
  let onKeyEvent = createKeybindingsHandler(keyBindingMap, { timeout });
  target.addEventListener(event, onKeyEvent, capture);
  return () => {
    target.removeEventListener(event, onKeyEvent, capture);
  };
}
