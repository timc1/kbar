"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var utils_1 = require("../utils");
var Command_1 = require("../action/Command");
var HistoryImpl_1 = require("../action/HistoryImpl");
var negate = jest.fn();
var perform = jest.fn().mockReturnValue(negate);
var baseAction = (0, utils_1.createAction)({
    name: "Test action",
    perform: perform,
});
var anotherAction = (0, utils_1.createAction)({
    name: "Test action 2",
    perform: perform,
});
var store = {};
describe("Command", function () {
    var actionImpl;
    var actionImpl2;
    beforeEach(function () {
        var _a;
        _a = [baseAction, anotherAction].map(function (action) {
            return __1.ActionImpl.create((0, utils_1.createAction)(action), {
                store: store,
                history: HistoryImpl_1.history,
            });
        }), actionImpl = _a[0], actionImpl2 = _a[1];
    });
    it("should create an instance of Command", function () {
        expect(actionImpl.command instanceof Command_1.Command).toBe(true);
        expect(actionImpl2.command instanceof Command_1.Command).toBe(true);
    });
    describe("History", function () {
        afterEach(function () {
            HistoryImpl_1.history.reset();
        });
        it("should properly interface with History", function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            expect(HistoryImpl_1.history.undoStack.length).toEqual(0);
            (_a = actionImpl.command) === null || _a === void 0 ? void 0 : _a.perform();
            expect(HistoryImpl_1.history.undoStack.length).toEqual(1);
            (_c = (_b = actionImpl.command) === null || _b === void 0 ? void 0 : _b.history) === null || _c === void 0 ? void 0 : _c.undo();
            (_e = (_d = actionImpl.command) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.undo();
            (_g = (_f = actionImpl.command) === null || _f === void 0 ? void 0 : _f.history) === null || _g === void 0 ? void 0 : _g.undo();
            (_j = (_h = actionImpl.command) === null || _h === void 0 ? void 0 : _h.history) === null || _j === void 0 ? void 0 : _j.undo();
            expect(HistoryImpl_1.history.undoStack.length).toEqual(0);
            expect(HistoryImpl_1.history.redoStack.length).toEqual(1);
        });
        it("should only register a single history record for each action", function () {
            var _a, _b, _c, _d;
            (_a = actionImpl.command) === null || _a === void 0 ? void 0 : _a.perform();
            (_b = actionImpl.command) === null || _b === void 0 ? void 0 : _b.perform();
            (_c = actionImpl2.command) === null || _c === void 0 ? void 0 : _c.perform();
            (_d = actionImpl2.command) === null || _d === void 0 ? void 0 : _d.perform();
            expect(HistoryImpl_1.history.undoStack.length).toEqual(2);
        });
        it("should undo/redo specific actions, not just at the top of the history stack", function () {
            var _a, _b, _c, _d, _e, _f;
            expect(HistoryImpl_1.history.undoStack.length).toEqual(0);
            (_a = actionImpl.command) === null || _a === void 0 ? void 0 : _a.perform();
            (_b = actionImpl2.command) === null || _b === void 0 ? void 0 : _b.perform();
            (_d = (_c = actionImpl.command) === null || _c === void 0 ? void 0 : _c.history) === null || _d === void 0 ? void 0 : _d.undo();
            // @ts-ignore historyItem is private, but using for purposes of testing equality
            expect(HistoryImpl_1.history.undoStack[0]).toEqual((_e = actionImpl2.command) === null || _e === void 0 ? void 0 : _e.historyItem);
            // @ts-ignore
            expect(HistoryImpl_1.history.redoStack[0]).toEqual((_f = actionImpl.command) === null || _f === void 0 ? void 0 : _f.historyItem);
        });
        it("should place redo actions back in the undo stack if action was re-perform", function () {
            var _a, _b, _c, _d, _e;
            (_a = actionImpl.command) === null || _a === void 0 ? void 0 : _a.perform();
            (_c = (_b = actionImpl.command) === null || _b === void 0 ? void 0 : _b.history) === null || _c === void 0 ? void 0 : _c.undo();
            expect(HistoryImpl_1.history.undoStack.length).toEqual(0);
            (_e = (_d = actionImpl.command) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.redo();
            expect(HistoryImpl_1.history.undoStack.length).toEqual(1);
            expect(HistoryImpl_1.history.redoStack.length).toEqual(0);
        });
    });
});
