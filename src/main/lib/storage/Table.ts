import fs from 'fs';
import { none, some } from '../rust-like-utils-backend/Optional';
import { Optional } from '../../../@types';



export class Table<S> {
  private readonly path: string;
  private readonly struct: S;
  private ramOnly = false;

  constructor(path: string, struct: S) {
    this.path = path;
    this.struct = struct;
  }

  get<K extends keyof S>(key: K): Optional<S[K]> {
    return this.struct[key] === undefined
      ? none()
      : some(this.struct[key]);
  }

  getStruct(): S {
    return this.struct;
  }

  write<K extends keyof S>(key: K, content: S[K]): void {
    this.struct[key] = content;

    if (this.ramOnly === true) {
      return;
    }

    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
  }

  delete<K extends keyof S>(key: K): void {
    delete this.struct[key];

    if (this.ramOnly === true) {
      return;
    }

    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
  }

  filePath(): string {
    return this.path;
  }

  hold() {
    this.ramOnly = true;
  }

  writeBack() {
    this.ramOnly = false;
    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
  }
}
