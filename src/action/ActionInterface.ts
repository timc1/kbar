import invariant from "tiny-invariant";
import type { ActionId, Action, History } from "../types";
import { ActionImpl } from "./ActionImpl";

interface ActionInterfaceOptions {
  historyManager?: History;
}
export class ActionInterface {
  actions: Record<ActionId, ActionImpl> = {};
  options: ActionInterfaceOptions;

  constructor(actions: Action[] = [], options: ActionInterfaceOptions = {}) {
    this.options = options;
    this.add(actions);
  }

  add(actions: Action[]) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (action.parent) {
        invariant(
          this.actions[action.parent],
          `Attempted to create action "${action.name}" without registering its parent "${action.parent}" first.`
        );
      }
      this.actions[action.id] = ActionImpl.create(action, {
        history: this.options.historyManager,
        store: this.actions,
      });
    }

    return { ...this.actions };
  }

  remove(actions: Action[]) {
    actions.forEach((action) => {
      const actionImpl = this.actions[action.id];
      if (!actionImpl) return;
      let children = actionImpl.children;
      while (children.length) {
        let child = children.pop();
        if (!child) return;
        delete this.actions[child.id];
        if (child.parentActionImpl) child.parentActionImpl.removeChild(child);
        if (child.children) children.push(...child.children);
      }
      if (actionImpl.parentActionImpl) {
        actionImpl.parentActionImpl.removeChild(actionImpl);
      }
      delete this.actions[action.id];
    });

    return { ...this.actions };
  }
}
