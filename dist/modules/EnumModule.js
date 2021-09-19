"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TS = require("typescript");
const ClientReplicate_1 = require("../ClientReplicate");
const Module_1 = require("./Module");
class EnumModule extends Module_1.default {
    export(decl, tc) {
        const ret = {
            name: undefined,
            fields: [],
            fullBodyText: decl.getText(),
        };
        return ret;
    }
    isExportable(node, tc) {
        if (!TS.isEnumDeclaration(node)) {
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
exports.default = EnumModule;
