import { shouldRejectKeystrokes } from "../utils";

interface HistoryItem {
  perform?: () => any;
  negate?: () => any;
}
interface IHistory {
  stack: HistoryItem[];
}

class History implements IHistory {
  static instance: History;
  reverseStack: HistoryItem[] = [];
  stack: HistoryItem[] = [];

  constructor() {
    if (!History.instance) {
      History.instance = this;

      window.addEventListener("keydown", (event) => {
        if (
          (!this.stack.length && !this.reverseStack.length) ||
          shouldRejectKeystrokes()
        ) {
          return;
        }

        const key = event.key?.toLowerCase();

        if (event.metaKey && key === "z" && event.shiftKey) {
          this.redo();
        } else if (event.metaKey && key === "z") {
          this.undo();
        }
      });
    }
    return History.instance;
  }

  undo() {
    const command = this.stack.pop();
    if (!command?.negate) return;
    command.negate();
    this.reverseStack.push(command);
  }

  redo() {
    const item = this.reverseStack.pop();
    if (item?.perform) {
      item.perform();
      if (item.negate) {
        this.stack.push(item);
      }
    }
  }

  add(item: HistoryItem) {
    this.stack.push(item);
  }

  remove(item: HistoryItem) {
    this.stack.filter((i) => i !== item);
  }
}

const history = new History();
Object.freeze(history);
export { history };
