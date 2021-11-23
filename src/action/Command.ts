import type { IHistory } from "../types";

interface CommandOptions {
  history?: any;
}
export class Command {
  private _history?: IHistory;
  history?: {
    undo?: any;
    redo?: any;
  };
  perform?: (...args: any) => any;

  constructor(command: { perform?: () => any }, options: CommandOptions) {
    this._history = options.history;
    const { perform } = command;

    this.perform =
      perform &&
      (() => {
        const negate = perform();
        const _history = this._history;
        if (!_history) return;
        if (typeof negate === "function") {
          const history = _history.add({
            perform,
            negate,
          });
          this.history = history;

          return history;
        }
      });
  }
}
