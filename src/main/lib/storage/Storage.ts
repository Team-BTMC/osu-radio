import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { TableMap } from '../../../@types';
import { Table } from './Table';



export class Storage {
  private static cache: Map<string, Table<any>> = new Map();

  static getTable<T extends keyof TableMap>(name: T): Table<TableMap[T]> {
    const hit = this.cache.get(name);

    if (hit !== undefined) {
      return hit;
    }

    const tablePath = path.join(app.getPath('userData'), `/storage/${name}.json`);

    if (!fs.existsSync(tablePath)) {
      fs.mkdirSync(path.join(app.getPath('userData'), '/storage'), { recursive: true });
      fs.writeFileSync(tablePath, '{}');
      return new Table(tablePath, {} as any);
    }

    const table = new Table(tablePath, JSON.parse(fs.readFileSync(tablePath, { encoding: 'utf8' })));
    this.cache.set(name, table);
    return table;
  }

  static setTable<T extends keyof TableMap>(name: T, contents: TableMap[T]): Table<TableMap[T]> {
    const tablePath = path.join(app.getPath('userData'), `/storage/${name}.json`);
    if (!fs.existsSync(tablePath)) {
      fs.mkdirSync(path.join(app.getPath('userData'), '/storage'), { recursive: true });
    }

    fs.writeFileSync(tablePath, JSON.stringify(contents));
    const t = new Table(tablePath, contents);

    this.cache.set(name, t);
    return t;
  }

  static removeTable<T extends keyof TableMap>(name: T): void {
    this.cache.delete(name);
    fs.unlinkSync(path.join(app.getPath('userData'), `/storage/${name}.json`));
  }
}
