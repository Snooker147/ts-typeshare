export default class TypeShare {
    private root;
    /** Rootpath must end with a slash */
    constructor(rootPath: string);
    generate(): Promise<string>;
}
