import * as TS from "typescript";
import Module, { ModuleExportedType } from "./Module";
export default class InterfaceModule extends Module<TS.InterfaceDeclaration> {
    export(decl: TS.InterfaceDeclaration, tc: TS.TypeChecker): ModuleExportedType;
    isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
}
