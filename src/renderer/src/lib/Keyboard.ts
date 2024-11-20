type Modifiers = "ctrl" | "shift" | "alt" | "cmd";

export type KeyboardRegister = {
  onPress: () => any;
  key: KeyboardEvent["key"];
  modifiers?: Modifiers[];
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

export class Keyboard {
  private static readonly registers: KeyboardRegister[] = [];

  private static initialized = false;

  static init() {
    if (this.initialized) {
      return;
    }

    this.initialized = !this.initialized;

    window.addEventListener("keydown", (evt) => {
      for (let i = 0; i < this.registers.length; i++) {
        const r = this.registers[i];

        if (r.key.toLowerCase() !== evt.key.toLowerCase()) {
          continue;
        }

        if (r.modifiers?.includes("ctrl") && evt.ctrlKey !== true) {
          continue;
        }

        if (r.modifiers?.includes("shift") && evt.shiftKey !== true) {
          continue;
        }

        if (r.modifiers?.includes("alt") && evt.altKey !== true) {
          continue;
        }

        if (r.modifiers?.includes("cmd") && evt.metaKey !== true) {
          continue;
        }

        const rModCount = r.modifiers !== undefined ? r.modifiers.length : 0;

        const evtModCount =
          Number(evt.altKey) + Number(evt.shiftKey) + Number(evt.ctrlKey) + Number(evt.metaKey);

        if (rModCount !== evtModCount) {
          continue;
        }

        r.onPress();

        if (r.preventDefault) {
          evt.preventDefault();
        }

        if (r.stopPropagation) {
          evt.stopPropagation();
          return;
        }
      }
    });
  }

  static register(r: KeyboardRegister): void {
    this.registers.push(r);
  }
}
