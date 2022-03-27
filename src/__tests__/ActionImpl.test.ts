import { ActionImpl } from "../action";
import { Action } from "../types";
import { createAction } from "../utils";

const perform = jest.fn();
const baseAction: Action = createAction({
  name: "Test action",
  perform,
});

const store = {};

describe("ActionImpl", () => {
  it("should create an instance of ActionImpl", () => {
    const action = ActionImpl.create(createAction(baseAction), {
      store,
    });
    expect(action instanceof ActionImpl).toBe(true);
  });

  it("should be able to add children", () => {
    const parent = ActionImpl.create(createAction({ name: "parent" }), {
      store: {},
    });

    expect(parent.children).toEqual([]);

    const child = ActionImpl.create(
      createAction({ name: "child", parent: parent.id }),
      {
        store: {
          [parent.id]: parent,
        },
      }
    );

    expect(parent.children[0]).toEqual(child);
  });

  it("should be able to get children", () => {
    const parent = ActionImpl.create(createAction({ name: "parent" }), {
      store: {},
    });
    const child = ActionImpl.create(
      createAction({ name: "child", parent: parent.id }),
      {
        store: {
          [parent.id]: parent,
        },
      }
    );
    const grandchild = ActionImpl.create(
      createAction({ name: "grandchild", parent: child.id }),
      {
        store: {
          [parent.id]: parent,
          [child.id]: child,
        },
      }
    );

    expect(parent.children.length).toEqual(1);
    expect(child.children.length).toEqual(1);
    expect(grandchild.children.length).toEqual(0);
  });
});
