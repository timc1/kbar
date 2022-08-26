"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var ActionInterface_1 = require("../action/ActionInterface");
var parent = (0, utils_1.createAction)({
    name: "parent",
});
var parent2 = (0, utils_1.createAction)({
    name: "parent2",
});
var child = (0, utils_1.createAction)({
    name: "child",
    parent: parent.id,
});
var grandchild = (0, utils_1.createAction)({
    name: "grandchild",
    parent: child.id,
});
var dummyActions = [parent, parent2, child, grandchild];
describe("ActionInterface", function () {
    var actionInterface;
    beforeEach(function () {
        actionInterface = new ActionInterface_1.ActionInterface();
    });
    it("throws an error when children are register before parents", function () {
        var bad = [grandchild, child, parent];
        expect(function () { return actionInterface.add(bad); }).toThrow();
    });
    it("sets actions internally", function () {
        var actions = actionInterface.add(dummyActions);
        expect(Object.keys(actionInterface.actions).length).toEqual(dummyActions.length);
        expect(actionInterface.actions).toEqual(actions);
    });
    it("removes actions and their respective children", function () {
        actionInterface.add(dummyActions);
        actionInterface.remove([parent]);
        expect(Object.keys(actionInterface.actions).length).toEqual(1);
        expect(Object.keys(actionInterface.actions)[0]).toEqual(parent2.id);
    });
});
