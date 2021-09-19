import * as Path from "path";
import * as FS from "fs";
import { TypeShare, ClientReplicate } from ".";

/** ClientReplicate */
enum SharedEnum {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCTION = "PRODUCTION",
}

/** ClientReplicate */
type SharedType = string | number;

class SharedClass implements ClientReplicate {
  public field: string;
  public age: number;
  public author: { firstname: string; surname: string; }; 
  public list: string[];
  public type: SharedType;
  public mode: SharedEnum;

  public functionsAreIgnored(field: string) {
    this.field = field;
  }
}

interface SharedInterface extends ClientReplicate {
  id: number;
  name: string;
  value: string;
}

(async function () {
  // root of "tsconfig.json" file
  const typeshare = new TypeShare(Path.join(__dirname, "..", "/"));
  
  console.log("Genereting typed files...");
  const generatedTypes = await typeshare.generate();

  FS.writeFileSync("test.ts", generatedTypes, { encoding: "utf-8" });
  console.log("Types generated to test.ts");
  
})();

