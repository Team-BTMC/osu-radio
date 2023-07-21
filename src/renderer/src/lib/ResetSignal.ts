export default class ResetSignal {
  private readonly listeners: (() => any)[];

  constructor() {
    this.listeners = [];
  }

  onReset(listener: () => any): void {
    this.listeners.push(listener);
  }

  removeOnReset(listener: () => any): void {
    const i = this.listeners.indexOf(listener);

    if (i === -1) {
      return;
    }

    this.listeners.splice(i, 1);
  }

  reset(): void {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i]();
    }
  }
}