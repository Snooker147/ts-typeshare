import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";
export default class ClassModule extends Module<TS.ClassDeclaration> {
    export(decl: TS.ClassDeclaration, tc: TS.TypeChecker): ModuleExportedType;
    isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
}
