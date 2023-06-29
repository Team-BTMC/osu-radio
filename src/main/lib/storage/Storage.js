import fs from "fs";
import path from "path";
import { app } from "electron";
import { Table } from "./Table";
export class Storage {
    static cache = new Map();
    static getTable(name) {
        const hit = this.cache.get(name);
        if (hit !== undefined) {
            return hit;
        }
        const tablePath = path.join(app.getPath("userData"), `/storage/${name}.json`);
        if (!fs.existsSync(tablePath)) {
            fs.mkdirSync(path.join(app.getPath("userData"), "/storage"), { recursive: true });
            fs.writeFileSync(tablePath, "{}");
            return new Table(tablePath, {});
        }
        const table = new Table(tablePath, JSON.parse(fs.readFileSync(tablePath, { encoding: "utf8" })));
        this.cache.set(name, table);
        return table;
    }
    static removeTable(name) {
        this.cache.delete(name);
        fs.unlinkSync(path.join(app.getPath("userData"), `/storage/${name}.json`));
    }
}
