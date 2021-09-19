"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TS = require("typescript");
const Module_1 = require("./Module");
class ClassModule extends Module_1.default {
    export(decl, tc) {
        const ret = {
            name: decl.name.text,
            type: "class",
            fields: [],
            generics: this.getGenerics(decl.typeParameters),
            inheritence: this.getInteheretence(tc, decl.heritageClauses),
        };
        this.isInhertedFromReplicable(ret.inheritence, true);
        decl.members.forEach(m => {
            if (!m.name) {
                return;
            }
            if (TS.isPropertyDeclaration(m)) {
                const field = this.getFieldFromSignature(m);
                if (field) {
                    ret.fields.push(field);
                }
            }
        });
        return ret;
    }
    isExportable(node, tc) {
        if (!TS.isClassDeclaration(node)) {
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
exports.default = ClassModule;
