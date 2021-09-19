import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";
export default class TypeModule extends Module<TS.TypeAliasDeclaration> {
    export(decl: TS.TypeAliasDeclaration, tc: TS.TypeChecker): ModuleExportedType;
    isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
}
