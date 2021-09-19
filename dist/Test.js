"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const FS = require("fs");
const _1 = require(".");
/** ClientReplicate */
var SharedEnum;
(function (SharedEnum) {
    SharedEnum["DEVELOPMENT"] = "DEVELOPMENT";
    SharedEnum["PRODUCTION"] = "PRODUCTION";
})(SharedEnum || (SharedEnum = {}));
class SharedClass {
    functionsAreIgnored(field) {
        this.field = field;
    }
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // root of "tsconfig.json" file
        const typeshare = new _1.TypeShare(Path.join(__dirname, "..", "/"));
        console.log("Genereting typed files...");
        const generatedTypes = yield typeshare.generate();
        FS.writeFileSync("test.ts", generatedTypes, { encoding: "utf-8" });
        console.log("Types generated to test.ts");
    });
})();
