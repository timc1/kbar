import { ActionInterface } from ".";
import { createAction } from "../utils";

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

// intentionally unordered to ensure order of actions registered does not matter.
const dummyActions = [grandchild, parent, child, parent2];

describe("ActionInterface", () => {
  let actionInterface: ActionInterface;
  beforeEach(() => {
    actionInterface = new ActionInterface();
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
