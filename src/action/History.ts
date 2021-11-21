import { shouldRejectKeystrokes } from "../utils";

interface HistoryItem {
  perform?: () => any;
  negate?: () => any;
}

class History {
  static instance: History;
  undoStack: HistoryItem[] = [];
  redoStack: HistoryItem[] = [];

  constructor() {
    if (!History.instance) {
      History.instance = this;

      window.addEventListener("keydown", (event) => {
        if (
          (!this.redoStack.length && !this.undoStack.length) ||
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

  private undo() {
    const command = this.redoStack.pop();
    if (!command?.negate) return;
    command.negate();
    this.undoStack.push(command);
  }

  private redo() {
    const item = this.undoStack.pop();
    if (item?.perform) {
      item.perform();
      if (item.negate) {
        this.redoStack.push(item);
      }
    }
  }

  add(item: HistoryItem) {
    this.redoStack.push(item);
  }

  remove(item: HistoryItem) {
    this.redoStack.filter((i) => i !== item);
  }
}

const history = new History();
Object.freeze(history);
export { history };
