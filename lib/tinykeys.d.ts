/**
 * A map of keybinding strings to event handlers.
 */
export interface KeyBindingMap {
    [keybinding: string]: (event: KeyboardEvent) => void;
}
/**
 * Options to configure the behavior of keybindings.
 */
export interface KeyBindingOptions {
    /**
     * Key presses will listen to this event (default: "keydown").
     */
    event?: "keydown" | "keyup";
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
export default function keybindings(target: Window | HTMLElement, keyBindingMap: KeyBindingMap, options?: KeyBindingOptions): () => void;
