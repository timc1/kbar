"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionImpl = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var Command_1 = require("./Command");
var utils_1 = require("../utils");
/**
 * Extends the configured keywords to include the section
 * This allows section names to be searched for.
 */
var extendKeywords = function (_a) {
    var _b = _a.keywords, keywords = _b === void 0 ? "" : _b, _c = _a.section, section = _c === void 0 ? "" : _c;
    return (keywords + " " + (typeof section === "string" ? section : section.name)).trim();
};
var ActionImpl = /** @class */ (function () {
    function ActionImpl(action, options) {
        var _this = this;
        var _a;
        this.priority = utils_1.Priority.NORMAL;
        this.ancestors = [];
        this.children = [];
        Object.assign(this, action);
        this.id = action.id;
        this.name = action.name;
        this.keywords = extendKeywords(action);
        var perform = action.perform;
        this.command =
            perform &&
                new Command_1.Command({
                    perform: function () { return perform(_this); },
                }, {
                    history: options.history,
                });
        // Backwards compatibility
        this.perform = (_a = this.command) === null || _a === void 0 ? void 0 : _a.perform;
        if (action.parent) {
            var parentActionImpl = options.store[action.parent];
            (0, tiny_invariant_1.default)(parentActionImpl, "attempted to create an action whos parent: " + action.parent + " does not exist in the store.");
            parentActionImpl.addChild(this);
        }
    }
    ActionImpl.prototype.addChild = function (childActionImpl) {
        // add all ancestors for the child action
        childActionImpl.ancestors.unshift(this);
        var parent = this.parentActionImpl;
        while (parent) {
            childActionImpl.ancestors.unshift(parent);
            parent = parent.parentActionImpl;
        }
        // we ensure that order of adding always goes
        // parent -> children, so no need to recurse
        this.children.push(childActionImpl);
    };
    ActionImpl.prototype.removeChild = function (actionImpl) {
        var _this = this;
        // recursively remove all children
        var index = this.children.indexOf(actionImpl);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        if (actionImpl.children) {
            actionImpl.children.forEach(function (child) {
                _this.removeChild(child);
            });
        }
    };
    Object.defineProperty(ActionImpl.prototype, "parentActionImpl", {
        // easily access parentActionImpl after creation
        get: function () {
            return this.ancestors[this.ancestors.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    ActionImpl.create = function (action, options) {
        return new ActionImpl(action, options);
    };
    return ActionImpl;
}());
exports.ActionImpl = ActionImpl;
