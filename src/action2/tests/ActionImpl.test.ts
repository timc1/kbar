import { ActionImpl2 } from "..";
import { Action2, createAction } from "../..";

const perform = jest.fn();
const baseAction: Action2 = createAction({
  name: "Test action",
  perform,
});

const store = {};

describe("ActionImpl", () => {
  it("should create an instance of ActionImpl2", () => {
    const action = ActionImpl2.create(createAction(baseAction), {
      store,
    });
    expect(action instanceof ActionImpl2).toBe(true);
  });

  // it("should be able to add children", () => {
  //   const parent = ActionImpl2.create(createAction({ name: "parent" }, {store}));

  //   expect(parent.children).toEqual([]);

  //   const child = ActionImpl2.create(
  //     createAction({ name: "child", parent: parent.id }),
  //     { parent }
  //   );

  //   parent.addChild(child);

  //   expect(parent.children[0]).toEqual(child);
  // });

  // it("should be able to get children", () => {
  //   const parent = ActionImpl2.create(createAction({ name: "parent" }));
  //   const child = ActionImpl2.create(
  //     createAction({ name: "child", parent: parent.id }),
  //     { parent }
  //   );
  //   const grandchild = ActionImpl2.create(
  //     createAction({ name: "grandchild", parent: child.id }),
  //     { parent: child }
  //   );

  //   expect(parent.children.length).toEqual(1);
  //   expect(child.children.length).toEqual(1);
  //   expect(grandchild.children.length).toEqual(0);
  // });
});
