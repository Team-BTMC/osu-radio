import { none, some } from "@shared/lib/rust-types/Optional";
import { Optional } from "@shared/types/common.types";
import fs from "fs";

export class Table<S> {
  private readonly path: string;
  private readonly struct: S;
  private ramOnly = false;

  constructor(path: string, struct: S) {
    this.path = path;
    this.struct = struct;
  }

  get<K extends keyof S>(key: K): Optional<S[K]> {
    return this.struct[key] === undefined ? none() : some(this.struct[key]);
  }

  /**
   * Returns underlying structure of this table
   */
  getStruct(): S {
    return this.struct;
  }

  /**
   * Writes content to given key (row). The contents are automatically saved to table file, unless {@link Table.hold}
   * had been called
   * @param key
   * @param content
   */
  write<K extends keyof S>(key: K, content: S[K]): void {
    this.struct[key] = content;

    if (this.ramOnly === true) {
      return;
    }

    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: "utf8" });
  }

  /**
   * Remove given row. The contents are automatically saved to table file, unless {@link Table.hold}
   * had been called
   * @param key
   */
  delete<K extends keyof S>(key: K): void {
    delete this.struct[key];

    if (this.ramOnly === true) {
      return;
    }

    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: "utf8" });
  }

  /**
   * Return path to table file
   */
  filePath(): string {
    return this.path;
  }

  /**
   * All changes are not going to be automatically saved to file until {@link Table.writeBack} is called
   */
  hold() {
    this.ramOnly = true;
  }

  /**
   * Saves all changes to table file
   */
  writeBack() {
    this.ramOnly = false;
    fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: "utf8" });
  }
}
