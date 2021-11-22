import type { IHistory } from "../types";

interface CommandOptions {
  history?: any;
}
export class Command {
  history?: IHistory;
  perform?: () => any;
  negate?: () => any;

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
          this.negate = () => {
            negate();
            history.remove(this);
          };
          history.add(this);
        }
      });
  }
}
