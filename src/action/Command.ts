import type { IHistory } from "../types";

interface CommandOptions {
  history?: any;
}
export class Command {
  history?: IHistory;
  perform?: (...args: any) => any;
  negate?: (...args: any) => any;

  constructor(command: { perform?: () => any }, options: CommandOptions) {
    this.history = options.history;
    const { perform } = command;

    this.perform =
      perform &&
      (() => {
        const negate = perform();
        const history = this.history;
        if (!history) return;
        if (typeof negate === "function") {
          const hist = history.add({
            perform,
            negate,
          });
          this.negate = () => history.undo(hist);
        }
      });
  }
}
