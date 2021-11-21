import type { ActionId, Action } from "..";
import { ActionImpl } from "./ActionImpl";

export class ActionInterface {
  actions: Record<ActionId, ActionImpl> = {};

  constructor(actions: Action[] = []) {
    this.add(actions);
  }

  add(actions: Action[]) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.parent && !this.actions[action.parent]) {
        throw new Error(
          `Attempted to create action "${action.name}" without registering its parent "${action.parent}" first.`
        );
      }
      this.actions[action.id] = ActionImpl.create(action, {
        store: this.actions,
      });
    }

    return this.actions;
  }

  remove(actions: Action[]) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const actionImpl = this.actions[action.id];
      if (!actionImpl) break;
      let children = actionImpl.children;
      while (children.length) {
        let child = children.pop();
        if (!child) break;
        delete this.actions[child.id];
        if (child.parentActionImpl) {
          child.parentActionImpl.removeChild(child);
        }
        children = child.children;
      }
      if (actionImpl.parentActionImpl) {
        actionImpl.parentActionImpl.removeChild(actionImpl);
      }
      delete this.actions[actionImpl.id];
    }
    return this.actions;
  }
}
