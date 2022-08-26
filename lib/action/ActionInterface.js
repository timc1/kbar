"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionInterface = void 0;
var tiny_invariant_1 = __importDefault(require("tiny-invariant"));
var ActionImpl_1 = require("./ActionImpl");
var ActionInterface = /** @class */ (function () {
    function ActionInterface(actions, options) {
        if (actions === void 0) { actions = []; }
        if (options === void 0) { options = {}; }
        this.actions = {};
        this.options = options;
        this.add(actions);
    }
    ActionInterface.prototype.add = function (actions) {
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            if (action.parent) {
                (0, tiny_invariant_1.default)(this.actions[action.parent], "Attempted to create action \"" + action.name + "\" without registering its parent \"" + action.parent + "\" first.");
            }
            this.actions[action.id] = ActionImpl_1.ActionImpl.create(action, {
                history: this.options.historyManager,
                store: this.actions,
            });
        }
        return __assign({}, this.actions);
    };
    ActionInterface.prototype.remove = function (actions) {
        var _this = this;
        actions.forEach(function (action) {
            var actionImpl = _this.actions[action.id];
            if (!actionImpl)
                return;
            var children = actionImpl.children;
            while (children.length) {
                var child = children.pop();
                if (!child)
                    return;
                delete _this.actions[child.id];
                if (child.parentActionImpl)
                    child.parentActionImpl.removeChild(child);
                if (child.children)
                    children.push.apply(children, child.children);
            }
            if (actionImpl.parentActionImpl) {
                actionImpl.parentActionImpl.removeChild(actionImpl);
            }
            delete _this.actions[action.id];
        });
        return __assign({}, this.actions);
    };
    return ActionInterface;
}());
exports.ActionInterface = ActionInterface;
