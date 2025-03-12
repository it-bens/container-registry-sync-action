import { Core } from '../../Utils/GitHubAction/Core.js';
import { RegCtlBinary } from '../RegCtlBinary.js';
export declare class RegCtlBinaryBuilder {
    private readonly home;
    private readonly core;
    constructor(home: string, core: Core);
    build(version: string): RegCtlBinary;
}
