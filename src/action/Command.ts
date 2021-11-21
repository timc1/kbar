import { history } from "./History";
export class Command {
  perform?: () => any;
  negate?: () => any;

  constructor(command: { perform?: () => any }) {
    const { perform } = command;

    this.perform =
      perform &&
      (() => {
        const negate = perform();
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
