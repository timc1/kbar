import type { BaseAction, ActionTree } from "../types";
import { ActionImpl } from "./ActionImpl";

export default class ActionInterface {
  readonly actions: ActionTree = {};

  constructor(actions: BaseAction[]) {
    this.actions = this.add(actions);
  }

  add(actions: BaseAction[]) {
    const [rootActions, nestedActions] = actions.reduce(
      (acc, action) => {
        const index = !action.parent ? 0 : 1;
        acc[index].push(action);
        return acc;
      },
      [[], []] as BaseAction[][]
    );

    rootActions.forEach(
      (action) => (this.actions[action.id] = ActionImpl.fromJSON(action))
    );

    nestedActions.forEach((a) => {
      const parent = this.actions[a.parent!];
      if (!parent) return;
      const action = ActionImpl.fromJSON(a);
      parent.addChild(action);
      this.actions[action.id] = action;
    });

    return this.actions;
  }

  remove(actions: BaseAction[]) {
    actions.forEach((action) => {
      const actionImpl = this.actions[action.id];
      delete this.actions[action.id];
      if (actionImpl?.children) {
        this.remove(actionImpl.children);
      }
    });

    return this.actions;
  }
}
