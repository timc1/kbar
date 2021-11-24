import { HistoryItem } from "..";
import type { History } from "../types";

interface CommandOptions {
  history?: History;
}
export class Command {
  perform: (...args: any) => any;

  private historyItem?: HistoryItem;

  history?: {
    undo: History["undo"];
    redo: History["redo"];
  };

  constructor(
    command: { perform: Command["perform"] },
    options: CommandOptions = {}
  ) {
    this.perform = () => {
      const negate = command.perform();
      // no need for history if non negatable
      if (typeof negate !== "function") return;
      // return if no history enabled
      const history = options.history;
      if (!history) return;
      // since we are performing the same action, we'll clean up the
      // previous call to the action and create a new history record
      if (this.historyItem) {
        history.remove(this.historyItem);
      }
      this.historyItem = history.add({
        perform: command.perform,
        negate,
      });

      this.history = {
        undo: () => history.undo(this.historyItem),
        redo: () => history.redo(this.historyItem),
      };
    };
  }
}
