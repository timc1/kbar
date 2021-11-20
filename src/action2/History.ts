import { Command } from "./Command";

interface IHistory {
  stack: Command[];
}

class History implements IHistory {
  static instance: History;
  reverseStack: Command[] = [];
  stack: Command[] = [];

  constructor() {
    if (!History.instance) {
      History.instance = this;

      window.addEventListener("keydown", (event) => {
        if (!this.stack.length && !this.reverseStack.length) return;

        const inputs = ["input", "select", "button", "textarea"];
        const key = event.key?.toLowerCase();

        const activeElement = document.activeElement;
        const ignoreStrokes =
          activeElement &&
          (inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1 ||
            activeElement.attributes.getNamedItem("role")?.value ===
              "textbox" ||
            activeElement.attributes.getNamedItem("contenteditable")?.value ===
              "true");

        if (ignoreStrokes) {
          return;
        }

        if (event.metaKey && key === "z" && event.shiftKey) {
          const command = this.reverseStack.pop();
          if (command?.perform) {
            command.perform();
            if (command.negate) {
              this.stack.push(command);
            }
          }
        } else if (event.metaKey && key === "z") {
          const command = this.stack.pop();
          if (!command?.negate) return;
          command.negate();
          this.reverseStack.push(command);
        }
      });
    }
    return History.instance;
  }

  add(command: Command) {
    this.stack.push(command);
  }
}

const history = new History();
Object.freeze(history);
export { history };
