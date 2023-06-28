import fs from "fs";
import path from "path";
import { app } from "electron";
import { Song, Settings } from "../../../@types";
import { Table } from "./Table";



type TableMap = {
    "songs": { [key: string]: Song },
    "playlists": { [key: string]: Song[] },
    "settings": Settings
}



export class Storage {
    private static cache: Map<string, Table<any>> = new Map();

    static getTable<T extends keyof TableMap>(name: T): Table<TableMap[T]> {
        const hit = this.cache.get(name);

        if (hit !== undefined) {
            return hit;
        }

        const tablePath = path.join(app.getPath("userData"), `/storage/${name}.json`);

        if (!fs.existsSync(tablePath)) {
            fs.mkdirSync(path.join(app.getPath("userData"), "/storage"), { recursive: true });
            fs.writeFileSync(tablePath, "{}");
            return new Table(tablePath, {} as unknown);
        }

        const table = new Table(tablePath, JSON.parse(fs.readFileSync(tablePath, { encoding: "utf8" })));
        this.cache.set(name, table);
        return table;
    }
}
