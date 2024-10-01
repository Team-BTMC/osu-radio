import fs from 'graceful-fs';



export function access(path, mode: number | undefined = undefined): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(path,  mode, (err) => {
      resolve(err === null);
    });
  });
}



export function getSubDirs(dirPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.opendir(dirPath, { encoding: "utf8" }, async (err, dir) => {
      if (err !== null) {
        reject(err);
        return;
      }

      const dirs: string[] = [];

      for await (const dirent of dir) {
        if (dirent.isDirectory()) {
          dirs.push(dirent.name);
        }
      }

      resolve(dirs);
    });
  });
}



export function getFiles(dirPath: string, ext?: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.opendir(dirPath, { encoding: "utf8" }, async (err, dir) => {
      if (err !== null) {
        reject(err);
        return;
      }

      const files: string[] = [];
      for await (const dirent of dir) {
        if (dirent.isDirectory()) {
          continue;
        }

        if (ext !== undefined && !dirent.name.endsWith("." + ext)) {
          continue;
        }

        files.push(dirent.name);
      }

      resolve(files);
    });
  });
}



export function stat(path: string): Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err !== null) {
        reject(err);
        return;
      }

      resolve(stats);
    });
  });
}



export function readFile(path): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf8" }, (err, data) => {
      if (err !== null) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}