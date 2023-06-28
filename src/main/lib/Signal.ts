type SignalListener<T> = (value: T) => any;

export class Signal<T> {
    #value: T;
    #listeners: SignalListener<T>[] = [];



    constructor(startValue?: T) {
        this.#value = startValue;
    }

    listen(listener: SignalListener<T>): void {
        this.#listeners.push(listener);
    }

    set value(value: T) {
        this.#value = value;
        for (let i = 0; i < this.#listeners.length; i++) {
            this.#listeners[i](value);
        }
    }
}
