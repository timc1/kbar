"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_1 = require("../action");
var utils_1 = require("../utils");
var perform = jest.fn();
var baseAction = (0, utils_1.createAction)({
    name: "Test action",
    perform: perform,
});
var store = {};
describe("ActionImpl", function () {
    it("should create an instance of ActionImpl", function () {
        var action = action_1.ActionImpl.create((0, utils_1.createAction)(baseAction), {
            store: store,
        });
        expect(action instanceof action_1.ActionImpl).toBe(true);
    });
    it("should be able to add children", function () {
        var _a;
        var parent = action_1.ActionImpl.create((0, utils_1.createAction)({ name: "parent" }), {
            store: {},
        });
        expect(parent.children).toEqual([]);
        var child = action_1.ActionImpl.create((0, utils_1.createAction)({ name: "child", parent: parent.id }), {
            store: (_a = {},
                _a[parent.id] = parent,
                _a),
        });
        expect(parent.children[0]).toEqual(child);
    });
    it("should be able to get children", function () {
        var _a, _b;
        var parent = action_1.ActionImpl.create((0, utils_1.createAction)({ name: "parent" }), {
            store: {},
        });
        var child = action_1.ActionImpl.create((0, utils_1.createAction)({ name: "child", parent: parent.id }), {
            store: (_a = {},
                _a[parent.id] = parent,
                _a),
        });
        var grandchild = action_1.ActionImpl.create((0, utils_1.createAction)({ name: "grandchild", parent: child.id }), {
            store: (_b = {},
                _b[parent.id] = parent,
                _b[child.id] = child,
                _b),
        });
        expect(parent.children.length).toEqual(1);
        expect(child.children.length).toEqual(1);
        expect(grandchild.children.length).toEqual(0);
    });
});
