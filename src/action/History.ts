import type { IHistory, IHistoryItem } from "../types";
import { shouldRejectKeystrokes } from "../utils";

export class HistoryItem implements IHistoryItem {
  perform: () => any;
  negate: () => any;

  constructor(item: IHistoryItem) {
    this.perform = item.perform;
    this.negate = item.negate;
  }

  static create(item: IHistoryItem) {
    return new HistoryItem(item);
  }
}

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

  add(item: IHistoryItem) {
    const historyItem = HistoryItem.create(item);
    this.undoStack.push(historyItem);
    return historyItem;
  }

  remove(item: IHistoryItem) {
    const undoIndex = this.undoStack.findIndex((i) => i === item);
    if (undoIndex !== -1) {
      this.undoStack.splice(undoIndex, 1);
      return;
    }
    const redoIndex = this.redoStack.findIndex((i) => i === item);
    if (redoIndex !== -1) {
      this.redoStack.splice(redoIndex, 1);
    }
  }

  undo(item?: IHistoryItem) {
    // if not undoing a specific item, just undo the latest
    if (!item) {
      const item = this.undoStack.pop();
      if (!item) return;
      item?.negate();
      this.redoStack.push(item);
      return item;
    }
    // else undo the specific item
    const index = this.undoStack.findIndex((i) => i === item);
    if (index === -1) return;
    this.undoStack.splice(index, 1);
    item.negate();
    this.redoStack.push(item);
    return item;
  }

  redo(item?: IHistoryItem) {
    if (!item) {
      const item = this.redoStack.pop();
      if (!item) return;
      item?.perform();
      this.undoStack.push(item);
      return item;
    }
    const index = this.redoStack.findIndex((i) => i === item);
    this.redoStack.splice(index, 1);
    item.perform();
    this.undoStack.push(item);
    return item;
  }

  reset() {
    this.undoStack.splice(0);
    this.redoStack.splice(0);
  }
}

const history = new History();
Object.freeze(history);
export { history };
