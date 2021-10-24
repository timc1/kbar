import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import { randomId } from "../utils";

type ActionId = string;

interface Action {
  id: string;
  name: string;
  keywords?: string;
  shortcut?: string[];
  perform?: () => void;
  section?: string;
  parent?: ActionId | null | undefined;
  children?: ActionId[];
  icon?: string | React.ReactElement | React.ReactNode;
  subtitle?: string;
}

interface ActionImplOptions {}

export class ActionImpl implements Action {
  id: string;
  name: string;
  keywords?: string | undefined;
  shortcut?: string[] | undefined;
  perform?: (() => void) | undefined;
  section?: string | undefined;
  parent?: string | null | undefined;
  children?: string[] | undefined;
  icon?: ReactElement<any, string | JSXElementConstructor<any>> | ReactNode;
  subtitle?: string | undefined;

  options: ActionImplOptions;

  constructor(action: Action, options: ActionImplOptions) {
    this.validate(action);
  }

  addChild(action: ActionImpl) {
    if (!action.children) action.children = [];
  }

  private validate(action: Action) {
    // TODO: validate
    return;
  }

  static fromJSON(obj: Action, options: ActionImplOptions) {
    return new ActionImpl(obj, options);
  }
}
