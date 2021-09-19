import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";
export default class EnumModule extends Module<TS.EnumDeclaration> {
    export(decl: TS.EnumDeclaration, tc: TS.TypeChecker): ModuleExportedType;
    isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
}
