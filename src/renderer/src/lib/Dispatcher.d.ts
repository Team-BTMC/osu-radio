export type EmitterListener<Args> = (args?: Args) => any;
/**
 * @template EventMap Represents a map of possible events with argument tuple: { "mute": [boolean] }
 */
export declare class Dispatcher<EventMap> {
    #private;
    on<E extends keyof EventMap>(event: E, listener: EmitterListener<EventMap[E]>): void;
    dispatch<E extends keyof EventMap>(event: E, args: EventMap[E]): void;
}
