import fs from 'fs';
import { none, some } from '../rust-like-utils-backend/Optional';
export class Table {
    path;
    struct;
    constructor(path, struct) {
        this.path = path;
        this.struct = struct;
    }
    get(key) {
        return this.struct[key] === undefined
            ? none()
            : some(this.struct[key]);
    }
    write(key, content) {
        this.struct[key] = content;
        fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
    }
    delete(key) {
        delete this.struct[key];
        fs.writeFileSync(this.path, JSON.stringify(this.struct), { encoding: 'utf8' });
    }
    filePath() {
        return this.path;
    }
}
