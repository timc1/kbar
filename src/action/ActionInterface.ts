import { Action, ActionImpl } from "./ActionImpl";

export type SerializedActions = Action[];
export type ActionTree = Record<string, ActionImpl>;

export default class ActionInterface {
  readonly actions: ActionTree = {};

  constructor(serializedActions: SerializedActions) {
    this.actions = this.add(serializedActions);
  }

  add(serializedActions: SerializedActions) {
    const [rootActions, nestedActions] = serializedActions.reduce(
      (acc, action) => {
        const index = !action.parent ? 0 : 1;
        acc[index].push(action);
        return acc;
      },
      [[], []] as Action[][]
    );

    rootActions.forEach(
      (action) => (this.actions[action.id] = new ActionImpl(action))
    );

    nestedActions.forEach((a) => {
      const parent = this.actions[a.parent!];

      if (!parent) return;

      const action = new ActionImpl(a, { parent: parent.id });

      parent.addChild(action);

      this.actions[action.id] = action;
    });

    return this.actions;
  }

  remove(actions: Action[]) {
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
