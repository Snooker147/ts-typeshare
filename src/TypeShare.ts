import * as TS from "typescript";
import * as HJson from "hjson";

import Utils from "./Utils";

import Module, { ModuleExportedType } from "./modules/Module";
import ClassModule from "./modules/ClassModule";
import InterfaceModule from "./modules/InterfaceModule";
import TypeModule from "./modules/TypeModule";
import EnumModule from "./modules/EnumModule";

export default class TypeShare {
  private root: string;

  /** Rootpath must end with a slash */
  public constructor(rootPath: string) {
    this.root = rootPath;
  }

  public async generate() {
    const configRaw = Utils.readEnsured(`${this.root}tsconfig.json`);
    const config = HJson.parse(configRaw);

    const include: string[] = config.include;
    const compiler: any = config.compilerOptions;

    const files: string[] = [];

    for (const inc of include) {
      (await Utils.glob(`${this.root}${inc}`)).forEach(f => files.push(f));
    }

    const program = TS.createProgram(files, compiler);

    Module.registerModule(new ClassModule());
    Module.registerModule(new InterfaceModule());
    Module.registerModule(new TypeModule());
    Module.registerModule(new EnumModule());

    const ret: ModuleExportedType[] = [];

    for (const source of program.getSourceFiles()) {
      if (source.isDeclarationFile) {
        continue;
      }

      TS.forEachChild(source, s => {
        const resolved = Module.resolveNode(s, program.getTypeChecker());

        if (resolved) {
          ret.push(resolved);
        }
      });
    }

    const text: string[] = [];

    for (const entry of ret) {
      const lines: string[] = [];

      if (!entry.fullBodyText) {
        const keyword = entry.type === "class" ? "implements" : "extends";
        const generics = entry.generics ? `<${entry.generics.join(", ")}>` : "";
        const inherit = entry.inheritence && entry.inheritence.length ? ` ${keyword} ${entry.inheritence.join(", ")}` : "";
        const name = `${entry.name}${generics}${inherit}`

        // implements
        lines.push(`export ${entry.type} ${name}`);
        lines.push("{");

        for (const f of entry.fields) {
          lines.push(`\t${f.name}: ${f.type};`);
        }

        lines.push("}");
      }
      else {
        const gens = entry.generics?.length > 0 ? `<${entry.generics.join(", ")}>` : "";
        lines.push(`export ${entry.type || ""} ${entry.name || ""} ${gens} ${entry.useEquals ? "=" : ""} ${entry.fullBodyText}`);
      }

      text.push(lines.join("\n"));
    }

    return text.join("\n");
  }

}