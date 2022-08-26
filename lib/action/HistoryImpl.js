"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.HistoryItemImpl = void 0;
var utils_1 = require("../utils");
var HistoryItemImpl = /** @class */ (function () {
    function HistoryItemImpl(item) {
        this.perform = item.perform;
        this.negate = item.negate;
    }
    HistoryItemImpl.create = function (item) {
        return new HistoryItemImpl(item);
    };
    return HistoryItemImpl;
}());
exports.HistoryItemImpl = HistoryItemImpl;
var HistoryImpl = /** @class */ (function () {
    function HistoryImpl() {
        this.undoStack = [];
        this.redoStack = [];
        if (!HistoryImpl.instance) {
            HistoryImpl.instance = this;
            this.init();
        }
        return HistoryImpl.instance;
    }
    HistoryImpl.prototype.init = function () {
        var _this = this;
        if (typeof window === "undefined")
            return;
        window.addEventListener("keydown", function (event) {
            var _a;
            if ((!_this.redoStack.length && !_this.undoStack.length) ||
                (0, utils_1.shouldRejectKeystrokes)()) {
                return;
            }
            var key = (_a = event.key) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (event.metaKey && key === "z" && event.shiftKey) {
                _this.redo();
            }
            else if (event.metaKey && key === "z") {
                _this.undo();
            }
        });
    };
    HistoryImpl.prototype.add = function (item) {
        var historyItem = HistoryItemImpl.create(item);
        this.undoStack.push(historyItem);
        return historyItem;
    };
    HistoryImpl.prototype.remove = function (item) {
        var undoIndex = this.undoStack.findIndex(function (i) { return i === item; });
        if (undoIndex !== -1) {
            this.undoStack.splice(undoIndex, 1);
            return;
        }
        var redoIndex = this.redoStack.findIndex(function (i) { return i === item; });
        if (redoIndex !== -1) {
            this.redoStack.splice(redoIndex, 1);
        }
    };
    HistoryImpl.prototype.undo = function (item) {
        // if not undoing a specific item, just undo the latest
        if (!item) {
            var item_1 = this.undoStack.pop();
            if (!item_1)
                return;
            item_1 === null || item_1 === void 0 ? void 0 : item_1.negate();
            this.redoStack.push(item_1);
            return item_1;
        }
        // else undo the specific item
        var index = this.undoStack.findIndex(function (i) { return i === item; });
        if (index === -1)
            return;
        this.undoStack.splice(index, 1);
        item.negate();
        this.redoStack.push(item);
        return item;
    };
    HistoryImpl.prototype.redo = function (item) {
        if (!item) {
            var item_2 = this.redoStack.pop();
            if (!item_2)
                return;
            item_2 === null || item_2 === void 0 ? void 0 : item_2.perform();
            this.undoStack.push(item_2);
            return item_2;
        }
        var index = this.redoStack.findIndex(function (i) { return i === item; });
        if (index === -1)
            return;
        this.redoStack.splice(index, 1);
        item.perform();
        this.undoStack.push(item);
        return item;
    };
    HistoryImpl.prototype.reset = function () {
        this.undoStack.splice(0);
        this.redoStack.splice(0);
    };
    return HistoryImpl;
}());
var history = new HistoryImpl();
exports.history = history;
Object.freeze(history);
