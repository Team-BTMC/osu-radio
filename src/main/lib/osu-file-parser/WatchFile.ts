import { Result } from "@shared/types/common.types";
import { fail, ok } from "@shared/lib/rust-types/Result";
import fs from "fs";
import path from "path";

export class WatchFile {
  fileName: string;
  ctime: string;

  private constructor(fileName: string, ctime: string) {
    this.fileName = fileName;
    this.ctime = ctime;
  }

  static new(fullyQualifiedPath: string): Result<WatchFile, string> {
    if (!fs.existsSync(fullyQualifiedPath)) {
      return fail("File does not exists.");
    }

    return ok(
      new WatchFile(
        path.basename(fullyQualifiedPath),
        new Date(fs.lstatSync(fullyQualifiedPath).ctimeMs).toISOString(),
      ),
    );
  }
}
