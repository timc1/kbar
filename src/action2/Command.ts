import { history } from "./History";

interface ICommand {
  perform?: () => void;
  negate?: () => void;
}

export class Command implements ICommand {
  perform: ICommand["perform"];
  negate: ICommand["negate"];

  constructor(command: ICommand) {
    const { perform, negate } = command;
    this.perform =
      perform &&
      (() => {
        if (negate) history.add(this);
        perform();
      });
    this.negate = command.negate;
  }
}
