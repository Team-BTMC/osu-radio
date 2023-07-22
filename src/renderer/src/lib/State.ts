export class State<T extends {}> {
  private readonly schema: Map<keyof T, T[keyof T]>;
  constructor() {
    this.schema = new Map();
  }

  set<K extends keyof T>(key: K, value: T[K]): State<T> {
    this.schema.set(key, value);
    return this;
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.schema.get(key);
  }
}