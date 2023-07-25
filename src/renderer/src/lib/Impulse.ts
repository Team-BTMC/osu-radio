export type ImpulseListener<T> = (arg: T) => any;



export default class Impulse<T = void> {
  private readonly listeners: ImpulseListener<T>[];

  constructor() {
    this.listeners = [];
  }

  listen(listener: ImpulseListener<T>): void {
    this.listeners.push(listener);
  }

  removeListener(listener: ImpulseListener<T>): void {
    const i = this.listeners.indexOf(listener);

    if (i === -1) {
      return;
    }

    this.listeners.splice(i, 1);
  }

  pulse(arg: T): void {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](arg);
    }
  }
}