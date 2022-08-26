"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var Command = /** @class */ (function () {
    function Command(command, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.perform = function () {
            var negate = command.perform();
            // no need for history if non negatable
            if (typeof negate !== "function")
                return;
            // return if no history enabled
            var history = options.history;
            if (!history)
                return;
            // since we are performing the same action, we'll clean up the
            // previous call to the action and create a new history record
            if (_this.historyItem) {
                history.remove(_this.historyItem);
            }
            _this.historyItem = history.add({
                perform: command.perform,
                negate: negate,
            });
            _this.history = {
                undo: function () { return history.undo(_this.historyItem); },
                redo: function () { return history.redo(_this.historyItem); },
            };
        };
    }
    return Command;
}());
exports.Command = Command;
