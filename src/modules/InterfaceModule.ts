import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";

export default class InterfaceModule extends Module<TS.InterfaceDeclaration>
{
  public export(decl: TS.InterfaceDeclaration, tc: TS.TypeChecker): ModuleExportedType {
    const ret: ModuleExportedType = {
      name: decl.name.text,
      type: "interface",
      fields: [],
      generics: this.getGenerics(decl.typeParameters),
      inheritence: this.getInteheretence(tc, decl.heritageClauses),
    }

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

  public isExportable(node: TS.Node, tc: TS.TypeChecker) {
    if (!TS.isInterfaceDeclaration(node)) {
      return false;
    }

    const cls: TS.InterfaceDeclaration = node;
    const inheritence = this.getInteheretence(tc, cls.heritageClauses);

    if (!inheritence || !this.isInhertedFromReplicable(inheritence, false)) {
      return false;
    }

    return true;
  }

}