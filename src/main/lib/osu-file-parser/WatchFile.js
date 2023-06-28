import fs from "fs";
import path from "path";
import { fail, ok } from "../rust-like-utils-backend/Result";
export class WatchFile {
    fileName;
    ctime;
    constructor(fileName, ctime) {
        this.fileName = fileName;
        this.ctime = ctime;
    }
    static new(fullyQualifiedPath) {
        if (!fs.existsSync(fullyQualifiedPath)) {
            return fail("File does not exists.");
        }
        return ok(new WatchFile(path.basename(fullyQualifiedPath), new Date(fs.lstatSync(fullyQualifiedPath).ctimeMs).toISOString()));
    }
}
