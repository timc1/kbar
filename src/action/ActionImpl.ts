import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import { Action, ActionId } from "../types";

export class ActionImpl implements Action {
  id: ActionId;
  name: string;
  keywords?: string | undefined;
  shortcut?: string[] | undefined;
  perform?: (() => void) | undefined;
  section?: string | undefined;
  parent?: string | null | undefined;
  children?: ActionImpl[] | undefined;
  icon?: ReactElement<any, string | JSXElementConstructor<any>> | ReactNode;
  subtitle?: string | undefined;

  constructor(action: Action) {
    this.parent = action.parent;
    this.validate(action);

    this.id = action.id;
    this.name = action.name;
    this.keywords = action.keywords;
    this.shortcut = action.shortcut;
    this.perform = action.perform;
    this.section = action.section;
    this.icon = action.icon;
    this.subtitle = action.subtitle;
  }

  addChild(action: ActionImpl) {
    if (!this.children) this.children = [];
    if (this.children.indexOf(action) > -1) return action;
    this.children.unshift(action);
    action.parent = this.id;
    return action;
  }

  private validate(action: Action) {
    // TODO: validate
    return;
  }

  static fromJSON(obj: Action) {
    return new ActionImpl(obj);
  }
}
