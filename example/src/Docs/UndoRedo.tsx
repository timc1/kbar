import * as React from "react";
import Code from "../Code";

export default function UndoRedo() {
  return (
    <div>
      <h1>Undo/Redo</h1>
      <p>
        When instantiating kbar, we can optionally enable undo/redo
        functionality through <code>options.enableHistory</code>:
      </p>
      <Code
        code={`
<KBarProvider
  // actions={[...]}
  options={{
    enableHistory: true
  }}
/>
      `}
      />
      <p>
        When we use <code>enableHistory</code>, we let kbar know that we would
        like to use the internal <code>HistoryImpl</code> object to store
        actions that are undoable in a history stack.
      </p>
      <p>
        When enabled, keyboard shortcuts <code>meta</code>
        <code>z</code> and <code>meta</code>
        <code>shift</code>
        <code>z</code> will appropriately undo and redo actions in the stack.
      </p>
      <h2>Creating the negate action</h2>
      <p>
        You may notice that we only have a <code>perform</code> property on an{" "}
        <code>Action</code>. To define the negate action, simply return a
        function from the <code>perform</code>:
      </p>
      <Code
        code={`
createAction({
  perform: () => {
    // logic to perform action
    return () => {
      // logic to undo the action
    }
  },
  // ...
})
     `}
      />
    </div>
  );
}
