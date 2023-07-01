/**
 * @template EventMap Represents a map of possible events with argument tuple: { "mute": [boolean] }
 */
export class Dispatcher {
    #listeners = new Map();
    on(event, listener) {
        const listeners = this.#listeners.get(event);
        if (listeners === undefined) {
            this.#listeners.set(event, [listener]);
            return;
        }
        listeners.push(listener);
    }
    dispatch(event, args) {
        const listeners = this.#listeners.get(event);
        if (listeners === undefined) {
            return;
        }
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](args);
        }
    }
}
