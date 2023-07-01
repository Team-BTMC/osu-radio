export class SongBuilder {
    song = {};
    set(key, value) {
        this.song[key] = value;
        return this;
    }
    build() {
        return this.song;
    }
}
