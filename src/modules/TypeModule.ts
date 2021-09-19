import * as TS from "typescript";
import { ClientReplicateComment } from "../ClientReplicate";
import Module, { ModuleExportedType } from "./Module";

export default class TypeModule extends Module<TS.TypeAliasDeclaration>
{
  public export(decl: TS.TypeAliasDeclaration, tc: TS.TypeChecker): ModuleExportedType {
    const ret: ModuleExportedType = {
      name: decl.name.text,
      type: "type",
      useEquals: true,
      fields: [],
      fullBodyText: decl.type.getText(),
      generics: this.getGenerics(decl.typeParameters),
    };

    return ret;
  }

  public isExportable(node: TS.Node, tc: TS.TypeChecker) {
    if (!TS.isTypeAliasDeclaration(node)) {
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