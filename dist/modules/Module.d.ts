import * as TS from "typescript";
declare type ExportedField = {
    name: string;
    type: string;
};
declare type ExportedType = {
    name: string;
    useEquals?: boolean;
    type?: "interface" | "class" | "type";
    fields: ExportedField[];
    fullBodyText?: string;
    generics?: string[];
    inheritence?: string[];
};
export default abstract class Module<T> {
    private static modules;
    abstract isExportable(node: TS.Node, tc: TS.TypeChecker): boolean;
    abstract export(node: T, tc: TS.TypeChecker): ExportedType;
    protected getGenerics(list: TS.NodeArray<TS.TypeParameterDeclaration>): string[];
    protected getInteheretence(tc: TS.TypeChecker, list: TS.NodeArray<TS.HeritageClause>): string[];
    protected isInhertedFromReplicable(inheritence: string[], remove: boolean): boolean;
    protected getFieldFromSignature(sig: TS.PropertySignature | TS.PropertyDeclaration): ExportedField;
    static registerModule(module: Module<any>): void;
    static resolveNode(node: TS.Node, tc: TS.TypeChecker): ExportedType;
}
export { ExportedField as ModuleExportedField, ExportedType as ModuleExportedType, };
