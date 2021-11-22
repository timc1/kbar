import invariant from "tiny-invariant";
import type { ActionId, Action, IHistory } from "../types";
import { ActionImpl } from "./ActionImpl";

interface ActionInterfaceOptions {
  historyManager?: IHistory;
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
