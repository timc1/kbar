import type { ActionId, Action } from "..";
import { ActionImpl } from "./ActionImpl";

export class ActionInterface {
  actions: Record<ActionId, ActionImpl> = {};

  constructor(actions: Action[] = []) {
    this.add(actions);
  }

  add(actions: Action[]) {
    // store actions by key for fast read
    const actionsByKey: Record<ActionId, Action> = actions.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {}
    );
    // create actions, ensure actions are ordered
    // from "oldest" to "youngest"; i.e. grandparent
    // action must be created prior to parent action,
    // parent must be created prior to child, etc.

    for (let i = 0; i < actions.length; i++) {
      let action = actions[i];
      if (!action) break;

      let orderedActions: Action[] = [action];

      let parent = action.parent;
      while (parent) {
        if (!this.actions[parent]) {
          orderedActions.push(actionsByKey[parent]);
        }
        parent = actionsByKey[parent]?.parent;
      }

      while (orderedActions.length) {
        const action = orderedActions.pop();
        if (!action) break;

        this.actions[action.id] = ActionImpl.create(action, {
          store: this.actions,
        });
      }
    }

    return this.actions;
  }

  remove(actions: Action[]) {
    for (let i = 0; i < actions.length; i++) {
      const actionImpl = this.actions[actions[i].id];
      if (!actionImpl) break;

      let children = actionImpl.children;
      while (children) {
        let child = children.pop();
        if (!child) break;
        delete this.actions[child.id];
        if (child.parentActionImpl) {
          child.parentActionImpl.removeChild(child);
        }
      }

      if (actionImpl.parentActionImpl) {
        actionImpl.parentActionImpl.removeChild(actionImpl);
      }

      delete this.actions[actionImpl.id];
    }
    return this.actions;
  }
}
