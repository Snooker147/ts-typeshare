"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TS = require("typescript");
const ClientReplicate_1 = require("../ClientReplicate");
const Module_1 = require("./Module");
class TypeModule extends Module_1.default {
    export(decl, tc) {
        const ret = {
            name: decl.name.text,
            type: "type",
            useEquals: true,
            fields: [],
            fullBodyText: decl.type.getText(),
            generics: this.getGenerics(decl.typeParameters),
        };
        return ret;
    }
    isExportable(node, tc) {
        if (!TS.isTypeAliasDeclaration(node)) {
            return false;
        }
        const symbol = tc.getSymbolAtLocation(node.name);
        if (symbol) {
            const comments = symbol.getDocumentationComment(tc).map(t => t.text);
            for (const comment of comments) {
                if (comment.trim().startsWith(ClientReplicate_1.ClientReplicateComment)) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.default = TypeModule;
