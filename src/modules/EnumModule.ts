import * as TS from "typescript";
import { ClientReplicateComment } from "../ClientReplicate";
import Module, { ModuleExportedType } from "./Module";

export default class EnumModule extends Module<TS.EnumDeclaration>
{
  public export(decl: TS.EnumDeclaration, tc: TS.TypeChecker): ModuleExportedType {
    const ret: ModuleExportedType = {
      name: undefined,
      fields: [],
      fullBodyText: decl.getText(),
    };

    return ret;
  }

  public isExportable(node: TS.Node, tc: TS.TypeChecker) {
    if (!TS.isEnumDeclaration(node)) {
      return false;
    }

    const symbol = tc.getSymbolAtLocation(node.name);

    if (symbol) {
      const comments = symbol.getDocumentationComment(tc).map(t => t.text);

      for (const comment of comments) {
        if (comment.trim().startsWith(ClientReplicateComment)) {
          return true;
        }
      }
    }

    return false;
  }

}