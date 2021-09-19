"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TS = require("typescript");
const ClientReplicate_1 = require("../ClientReplicate");
class Module {
    getGenerics(list) {
        if (!list || list.length === 0) {
            return undefined;
        }
        return list.map(l => l.name.text);
    }
    getInteheretence(tc, list) {
        if (!list || list.length === 0) {
            return undefined;
        }
        const ret = [];
        for (const c of list) {
            for (const t of c.types) {
                ret.push(t.getText());
            }
        }
        return ret;
    }
    isInhertedFromReplicable(inheritence, remove) {
        if (inheritence.includes(ClientReplicate_1.ClientReplicateTypeName)) {
            if (remove) {
                inheritence.splice(inheritence.findIndex(i => i === ClientReplicate_1.ClientReplicateTypeName), 1);
            }
            return true;
        }
        return false;
    }
    getFieldFromSignature(sig) {
        var _a, _b;
        const isPrivate = Boolean((_a = sig.modifiers) === null || _a === void 0 ? void 0 : _a.find(m => m.kind === TS.SyntaxKind.PrivateKeyword));
        if (isPrivate) {
            return undefined;
        }
        const type = sig.type ? sig.type.getText() : "any";
        const isStatic = Boolean((_b = sig.modifiers) === null || _b === void 0 ? void 0 : _b.find(m => m.kind === TS.SyntaxKind.StaticKeyword));
        if (isStatic) {
            const equals = sig.getText().lastIndexOf("=");
            return {
                name: `public static readonly ${sig.name.getText()}`,
                type: type + (equals === -1 ? "" : sig.getText().slice(equals))
            };
        }
        return {
            name: sig.name.getText(),
            type: type, // maybe even check if type is exported?
        };
    }
    static registerModule(module) {
        this.modules.push(module);
    }
    static resolveNode(node, tc) {
        for (const module of this.modules) {
            if (module.isExportable(node, tc)) {
                return module.export(node, tc);
            }
        }
        return undefined;
    }
}
exports.default = Module;
Module.modules = [];
