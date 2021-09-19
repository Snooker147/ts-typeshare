"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TS = require("typescript");
const Module_1 = require("./Module");
class InterfaceModule extends Module_1.default {
    export(decl, tc) {
        const ret = {
            name: decl.name.text,
            type: "interface",
            fields: [],
            generics: this.getGenerics(decl.typeParameters),
            inheritence: this.getInteheretence(tc, decl.heritageClauses),
        };
        this.isInhertedFromReplicable(ret.inheritence, true);
        decl.members.forEach(m => {
            if (!m.name) {
                return;
            }
            if (TS.isPropertySignature(m)) {
                ret.fields.push(this.getFieldFromSignature(m));
            }
        });
        return ret;
    }
    isExportable(node, tc) {
        if (!TS.isInterfaceDeclaration(node)) {
            return false;
        }
        const cls = node;
        const inheritence = this.getInteheretence(tc, cls.heritageClauses);
        if (!inheritence || !this.isInhertedFromReplicable(inheritence, false)) {
            return false;
        }
        return true;
    }
}
exports.default = InterfaceModule;
