import fs from 'fs';
import { none, some } from '../rust-like-utils-backend/Optional';
export class Table {
    path;
    struct;
    ramOnly = false;
    constructor(path, struct) {
        this.path = path;
        this.struct = struct;
    }
    get(key) {
        return this.struct[key] === undefined
            ? none()
            : some(this.struct[key]);
    }
    getStruct() {
        return this.struct;
    }
    write(key, content) {
        this.struct[key] = content;
        if (this.ramOnly === true) {
            return;
        }
        fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
    }
    delete(key) {
        delete this.struct[key];
        if (this.ramOnly === true) {
            return;
        }
        fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
    }
    filePath() {
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
