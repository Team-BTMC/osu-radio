export default class ResetSignal {
    listeners = [];
    onReset(listener) {
        this.listeners.push(listener);
    }
    removeOnReset(listener) {
        const i = this.listeners.indexOf(listener);
        if (i === -1) {
            return;
        }
        this.listeners.splice(i, 1);
    }
    reset() {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
        }
    }
}
