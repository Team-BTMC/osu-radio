export default class ResetSignal {
    private listeners;
    onReset(listener: () => any): void;
    removeOnReset(listener: () => any): void;
    reset(): void;
}
