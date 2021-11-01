import type { BaseAction, ActionId } from "../types";
import { ActionImpl } from "./ActionImpl";

export class ActionInterface {
  actions: Record<ActionId, ActionImpl> = {};

  constructor(actions: BaseAction[] = []) {
    this.actions = this.add(actions);
  }

  add(actions: BaseAction[]) {
    const actionsByKey: Record<ActionId, BaseAction> = actions.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {}
    );

    actions.forEach((action) => {
      if (this.actions[action.id]) return;

      let orderedActions: BaseAction[] = [action];

      let parent = action.parent;
      while (parent) {
        if (!this.actions[parent]) {
          orderedActions.push(actionsByKey[parent]);
        }
        parent = actionsByKey[parent]?.parent;
      }

      while (orderedActions.length) {
        const action = orderedActions.pop()!;
        if (!action) return;

        const parent = action.parent ? this.actions[action.parent] : undefined;
        this.actions[action.id] = ActionImpl.fromJSON(action, {
          parent,
        });
        if (parent) {
          parent.addChild(this.actions[action.id]);
        }
      }
    });

    return { ...this.actions };
  }

  remove(actions: BaseAction[]) {
    actions.forEach((action) => {
      const actionImpl = this.actions[action.id];
      if (!actionImpl) return;
      // if is parent action, remove _all_ children
      let children = actionImpl.children;
      while (children.length) {
        const child = children.pop()!;
        delete this.actions[child.id];
        if (child.children) {
          children.push(...child.children);
        }
      }
      // if child of a parent, remove from parent
      if (actionImpl.parent) {
        actionImpl.parent.removeChild(actionImpl);
      }
      delete this.actions[actionImpl.id];
    });

    return { ...this.actions };
  }
}
