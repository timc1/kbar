import * as React from "react";
import Code from "../Code";

export default function Priority() {
  return (
    <div>
      <h1>Priority</h1>
      <p>
        You&apos;ve successfully registered hundreds of actions and realize you
        want to control the order in which they appear.
      </p>
      <p>
        By default, each action has a base priority value of <code>0</code> (<code>Priority.NORMAL</code>).
        This means each action will be rendered in the order in which it was
        defined.
      </p>
      <h2>Command score</h2>
      <p>
        kbar uses <code>command-score</code> under the hood to filter actions
        based on the current search query. Each action will be given a score and
        we take the score and simply order by the highest to lowest value.
      </p>
      <p>
        For finer control, kbar enables you to pass a <code>priority</code>{" "}
        property as part of an action definition. <code>priority</code> is any
        number value which is then combined with the command score to determine
        the final sort order.
      </p>
      <p>
        You can use <code>priority</code> when defining an action's{" "}
        <code>section</code> property using the same interface.
      </p>
      <Code
        code={`
import { Priority } from "kbar"

const signupAction = createAction({
  name: "Signup",
  perform: () => {},
  section: "Recents"
  priority: Priority.LOW
})

const loginAction = createAction({
  name: "Login",
  perform: () => {},
  priority: Priority.HIGH 
})

const themeAction = createAction({
  name: "Dark mode",
  perform: () => {},
  section: {
    name: "Settings",
    priority: Priority.HIGH
  }
})

useRegisterActions([
  signupAction,
  loginAction,
  themeAction
])
      `}
      />
      <p>
        Using the above code as a reference, without any usage of{" "}
        <code>priority</code>, the order in which the actions will appear will
        be the order in which they were called:
      </p>
      <ol>
        <li>Signup</li>
        <li>Login</li>
        <li>Dark mode</li>
      </ol>
      <div>However, with the priorities in place, the order will be:</div>
      <ol>
        <li>Dark mode</li>
        <li>Login</li>
        <li>Signup</li>
      </ol>
      <p>Groups are sorted first and actions within groups are sorted after.</p>
    </div>
  );
}
