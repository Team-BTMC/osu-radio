export type EmitterListener<Args> = (args?: Args) => any;

/**
 * @template EventMap Represents a map of possible events with argument tuple: { "mute": [boolean] }
 */
export class Dispatcher<EventMap> {
    #listeners: Map<keyof EventMap, EmitterListener<any>[]> = new Map();

    on<E extends keyof EventMap>(event: E, listener: EmitterListener<EventMap[E]>): void {
        const listeners = this.#listeners.get(event);

        if (listeners === undefined) {
            this.#listeners.set(event, [listener]);
            return;
        }

        listeners.push(listener);
    }

    dispatch<E extends keyof EventMap>(event: E, args: EventMap[E]): void {
        const listeners = this.#listeners.get(event);

        if (event === undefined) {
            return;
        }

        for (let i = 0; i < listeners.length; i++) {
            listeners[i](args);
        }
    }
}