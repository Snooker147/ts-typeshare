"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
const Glob = require("glob");
class Utils {
    readEnsured(path) {
        if (!FS.existsSync(path)) {
            throw new Error(`${path} does not exist`);
        }
        return FS.readFileSync(path, { encoding: "utf-8" });
    }
    glob(str) {
        return new Promise((res, rej) => {
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
exports.default = new Utils();
