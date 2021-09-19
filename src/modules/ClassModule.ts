import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";

export default class ClassModule extends Module<TS.ClassDeclaration>
{
  public export(decl: TS.ClassDeclaration, tc: TS.TypeChecker): ModuleExportedType {
    const ret: ModuleExportedType = {
      name: decl.name.text,
      type: "class",
      fields: [],
      generics: this.getGenerics(decl.typeParameters),
      inheritence: this.getInteheretence(tc, decl.heritageClauses),
    }

    this.isInhertedFromReplicable(ret.inheritence, true);

    decl.members.forEach(m => {
      if (!m.name) {
        return;
      }

      if (TS.isPropertyDeclaration(m)) {
        const field = this.getFieldFromSignature(m);

        if(field) {
          ret.fields.push(field);
        }
      }
    });

    return ret;
  }

  public isExportable(node: TS.Node, tc: TS.TypeChecker) {
    if (!TS.isClassDeclaration(node)) {
      return false;
    }

    const cls: TS.ClassDeclaration = node;
    const inheritence = this.getInteheretence(tc, cls.heritageClauses);

    if (!inheritence || !this.isInhertedFromReplicable(inheritence, false)) {
      return false;
    }

    return true;
  }

}