import { createAction } from "../utils";
import { ActionInterface } from "../action/ActionInterface";

const parent = createAction({
  name: "parent",
});
const parent2 = createAction({
  name: "parent2",
});
const child = createAction({
  name: "child",
  parent: parent.id,
});
const grandchild = createAction({
  name: "grandchild",
  parent: child.id,
});

const dummyActions = [parent, parent2, child, grandchild];

describe("ActionInterface", () => {
  let actionInterface: ActionInterface;
  beforeEach(() => {
    actionInterface = new ActionInterface();
  });

  it("throws an error when children are register before parents", () => {
    const bad = [grandchild, child, parent];
    expect(() => actionInterface.add(bad)).toThrow();
  });

  it("sets actions internally", () => {
    const actions = actionInterface.add(dummyActions);
    expect(Object.keys(actionInterface.actions).length).toEqual(
      dummyActions.length
    );
    expect(actionInterface.actions).toEqual(actions);
  });

  it("removes actions and their respective children", () => {
    actionInterface.add(dummyActions);
    actionInterface.remove([parent]);
    expect(Object.keys(actionInterface.actions).length).toEqual(1);
    expect(Object.keys(actionInterface.actions)[0]).toEqual(parent2.id);
  });
});
