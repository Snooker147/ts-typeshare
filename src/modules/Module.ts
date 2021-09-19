import * as TS from "typescript";
import { ClientReplicateTypeName } from "../ClientReplicate";

type ExportedField = {
  name: string;
  type: string;
}

type ExportedType = {
  name: string;
  useEquals?: boolean;
  type?: "interface" | "class" | "type";
  fields: ExportedField[];
  fullBodyText?: string;
  generics?: string[];
  inheritence?: string[];
}

export default abstract class Module<T>
{
  private static modules: Module<any>[] = [];

  public abstract isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
  public abstract export(node: T, tc: TS.TypeChecker): ExportedType;

  protected getGenerics(list: TS.NodeArray<TS.TypeParameterDeclaration>) {
    if (!list || list.length === 0) {
      return undefined;
    }

    return list.map(l => l.name.text);
  }

  protected getInteheretence(tc: TS.TypeChecker, list: TS.NodeArray<TS.HeritageClause>) {
    if (!list || list.length === 0) {
      return undefined;
    }

    const ret: string[] = [];

    for (const c of list) {
      for (const t of c.types) {
        ret.push(t.getText());
      }
    }

    return ret;
  }

  protected isInhertedFromReplicable(inheritence: string[], remove: boolean) {
    if (inheritence.includes(ClientReplicateTypeName)) {
      if (remove) {
        inheritence.splice(inheritence.findIndex(i => i === ClientReplicateTypeName), 1);
      }

      return true;
    }

    return false;
  }

  protected getFieldFromSignature(sig: TS.PropertySignature | TS.PropertyDeclaration): ExportedField {
    const isPrivate = Boolean(sig.modifiers?.find(m => m.kind === TS.SyntaxKind.PrivateKeyword));

    if(isPrivate) {
      return undefined;
    }

    const type = sig.type ? sig.type.getText() : "any";
    const isStatic = Boolean(sig.modifiers?.find(m => m.kind === TS.SyntaxKind.StaticKeyword));

    if(isStatic) {
      const equals = sig.getText().lastIndexOf("=");

      return {
        name: `public static readonly ${sig.name.getText()}`,
        type: type + (equals === -1 ? "" : sig.getText().slice(equals))
      }
    }
    
    return {
      name: sig.name.getText(), // maybe add a way to alter name returned?
      type: type, // maybe even check if type is exported?
    };
  }

  public static registerModule(module: Module<any>) {
    this.modules.push(module);
  }

  public static resolveNode(node: TS.Node, tc: TS.TypeChecker) {
    for (const module of this.modules) {
      if (module.isExportable(node, tc)) {
        return module.export(node, tc);
      }
    }

    return undefined;
  }

}

export {
  ExportedField as ModuleExportedField,
  ExportedType as ModuleExportedType,
}