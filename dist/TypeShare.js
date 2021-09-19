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
const TS = require("typescript");
const HJson = require("hjson");
const Utils_1 = require("./Utils");
const Module_1 = require("./modules/Module");
const ClassModule_1 = require("./modules/ClassModule");
const InterfaceModule_1 = require("./modules/InterfaceModule");
const TypeModule_1 = require("./modules/TypeModule");
const EnumModule_1 = require("./modules/EnumModule");
class TypeShare {
    /** Rootpath must end with a slash */
    constructor(rootPath) {
        this.root = rootPath;
    }
    generate() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const configRaw = Utils_1.default.readEnsured(`${this.root}tsconfig.json`);
            const config = HJson.parse(configRaw);
            const include = config.include;
            const compiler = config.compilerOptions;
            const files = [];
            for (const inc of include) {
                (yield Utils_1.default.glob(`${this.root}${inc}`)).forEach(f => files.push(f));
            }
            const program = TS.createProgram(files, compiler);
            Module_1.default.registerModule(new ClassModule_1.default());
            Module_1.default.registerModule(new InterfaceModule_1.default());
            Module_1.default.registerModule(new TypeModule_1.default());
            Module_1.default.registerModule(new EnumModule_1.default());
            const ret = [];
            for (const source of program.getSourceFiles()) {
                if (source.isDeclarationFile) {
                    continue;
                }
                TS.forEachChild(source, s => {
                    const resolved = Module_1.default.resolveNode(s, program.getTypeChecker());
                    if (resolved) {
                        ret.push(resolved);
                    }
                });
            }
            const text = [];
            for (const entry of ret) {
                const lines = [];
                if (!entry.fullBodyText) {
                    const keyword = entry.type === "class" ? "implements" : "extends";
                    const generics = entry.generics ? `<${entry.generics.join(", ")}>` : "";
                    const inherit = entry.inheritence && entry.inheritence.length ? ` ${keyword} ${entry.inheritence.join(", ")}` : "";
                    const name = `${entry.name}${generics}${inherit}`;
                    // implements
                    lines.push(`export ${entry.type} ${name}`);
                    lines.push("{");
                    for (const f of entry.fields) {
                        lines.push(`\t${f.name}: ${f.type};`);
                    }
                    lines.push("}");
                }
                else {
                    const gens = ((_a = entry.generics) === null || _a === void 0 ? void 0 : _a.length) > 0 ? `<${entry.generics.join(", ")}>` : "";
                    lines.push(`export ${entry.type || ""} ${entry.name || ""} ${gens} ${entry.useEquals ? "=" : ""} ${entry.fullBodyText}`);
                }
                text.push(lines.join("\n"));
            }
            return text.join("\n");
        });
    }
}
exports.default = TypeShare;
