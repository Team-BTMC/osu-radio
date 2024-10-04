export class State<T extends {}, K extends keyof T = keyof T> {
  private readonly schema: Map<K, T[K]>;
  constructor() {
    this.schema = new Map();
  }

  set(key: K, value: T[K]): State<T> {
    this.schema.set(key, value);
    return this;
  }

  get(key: K): T[K] | undefined {
    return this.schema.get(key);
  }
}
