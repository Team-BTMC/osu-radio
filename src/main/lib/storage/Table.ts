import fs from 'fs';
import { none, some } from '../rust-like-utils-backend/Optional';
import { Optional } from '../../../@types';



export class Table<Struct> {
  private readonly path: string;
  private readonly struct: Struct;

  constructor(path: string, struct: Struct) {
    this.path = path;
    this.struct = struct;
  }

  get<K extends keyof Struct>(key: K): Optional<Struct[K]> {
    return this.struct[key] === undefined
      ? none()
      : some(this.struct[key]);
  }

  write<K extends keyof Struct>(key: K, content: Struct[K]): void {
    this.struct[key] = content;
    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
  }

  delete<K extends keyof Struct>(key: K): void {
    delete this.struct[key];
    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
  }

  filePath(): string {
    return this.path;
  }
}
