import { HistoryItem, IHistory } from "../types";
import { shouldRejectKeystrokes } from "../utils";

class History implements IHistory {
  static instance: History;
  undoStack: HistoryItem[] = [];
  redoStack: HistoryItem[] = [];

  constructor() {
    if (!History.instance) {
      History.instance = this;
      this.init();
    }
    return History.instance;
  }

  init() {
    if (typeof window === "undefined") return;

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

  private undo() {
    const item = this.redoStack.pop();
    if (!item?.negate) return;
    item.negate();
    this.undoStack.push(item);
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
