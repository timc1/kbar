"use strict";
/**
 * @jest-environment jsdom
 */
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
var useKBar_1 = require("../useKBar");
var KBarContextProvider_1 = require("../KBarContextProvider");
var react_1 = require("@testing-library/react");
var React = __importStar(require("react"));
var utils_1 = require("../utils");
var useMatches_1 = require("../useMatches");
jest.mock("../utils", function () {
    return __assign(__assign({}, jest.requireActual("../utils")), { 
        // Mock out throttling as we don't need it in our test environment.
        useThrottledValue: function (value) { return value; } });
});
function Search() {
    var _a = (0, useKBar_1.useKBar)(function (state) { return ({
        search: state.searchQuery,
    }); }), search = _a.search, query = _a.query;
    return (React.createElement("input", { "aria-label": "search-input", value: search, onChange: function (e) { return query.setSearch(e.target.value); } }));
}
function Results() {
    var results = (0, useMatches_1.useMatches)().results;
    return (React.createElement("ul", null, results.map(function (result) {
        return typeof result === "string" ? (React.createElement("li", { key: result }, result)) : (React.createElement("li", { key: result.id }, result.name));
    })));
}
function BasicComponent() {
    var action1 = (0, utils_1.createAction)({ name: "Action 1" });
    var action2 = (0, utils_1.createAction)({ name: "Action 2" });
    var action3 = (0, utils_1.createAction)({ name: "Action 3" });
    var childAction1 = (0, utils_1.createAction)({
        name: "Child Action 1",
        parent: action1.id,
    });
    return (React.createElement(KBarContextProvider_1.KBarProvider, { actions: [action1, action2, action3, childAction1] },
        React.createElement(Search, null),
        React.createElement(Results, null)));
}
function WithPriorityComponent() {
    var action1 = (0, utils_1.createAction)({ name: "Action 1", priority: utils_1.Priority.LOW });
    var action2 = (0, utils_1.createAction)({ name: "Action 2", priority: utils_1.Priority.HIGH });
    var action3 = (0, utils_1.createAction)({ name: "Action 3", priority: utils_1.Priority.HIGH });
    var action4 = (0, utils_1.createAction)({
        name: "Action 4",
        priority: utils_1.Priority.HIGH,
        section: {
            name: "Section 1",
            priority: utils_1.Priority.HIGH,
        },
    });
    var childAction1 = (0, utils_1.createAction)({
        name: "Child Action 1",
        parent: action1.id,
    });
    return (React.createElement(KBarContextProvider_1.KBarProvider, { actions: [action1, action2, action3, action4, childAction1] },
        React.createElement(Search, null),
        React.createElement(Results, null)));
}
var setup = function (Component) {
    var utils = (0, react_1.render)(React.createElement(Component, null));
    var input = utils.getByLabelText("search-input");
    return __assign({ input: input }, utils);
};
describe("useMatches", function () {
    describe("Basic", function () {
        var utils;
        beforeEach(function () {
            utils = setup(BasicComponent);
        });
        it("returns root results with an empty search query", function () {
            var results = utils.getAllByText(/Action/i);
            expect(results.length).toEqual(3);
            expect(results[0].textContent).toEqual("Action 1");
            expect(results[1].textContent).toEqual("Action 2");
            expect(results[2].textContent).toEqual("Action 3");
        });
        it("returns nested results when search query is present", function () {
            var input = utils.input;
            react_1.fireEvent.change(input, { target: { value: "1" } });
            var results = utils.getAllByText(/Action/i);
            expect(results.length).toEqual(2);
            expect(results[0].textContent).toEqual("Action 1");
            expect(results[1].textContent).toEqual("Child Action 1");
        });
    });
    describe("With priority", function () {
        var utils;
        beforeEach(function () {
            utils = setup(WithPriorityComponent);
        });
        it("returns a prioritized list", function () {
            var results = utils.getAllByText(/Action/i);
            expect(results.length).toEqual(4);
            expect(results[0].textContent).toEqual("Action 4");
            expect(results[1].textContent).toEqual("Action 2");
            expect(results[2].textContent).toEqual("Action 3");
            expect(results[3].textContent).toEqual("Action 1");
            expect(utils.queryAllByText(/Section 1/i));
        });
    });
});
