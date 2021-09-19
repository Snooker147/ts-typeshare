import * as FS from "fs";
import * as Glob from "glob";

class Utils {

  public readEnsured(path: string) {
    if (!FS.existsSync(path)) {
      throw new Error(`${path} does not exist`);
    }

    return FS.readFileSync(path, { encoding: "utf-8" });
  }

  public glob(str: string) {
    return new Promise<string[]>((res, rej) => {
      Glob(str, (err, matches) => {
        if (err) {
          rej(err);
        }
        else {
          res(matches);
        }
      });
    });
  }

}

export default new Utils();