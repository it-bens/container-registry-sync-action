import { CoreInterface } from '../../Utils/GitHubAction/CoreInterface.js';
import { RegCtlBinary } from '../RegCtlBinary.js';
import { RegCtlBinaryBuilderInterface } from './RegCtlBinaryBuilderInterface.js';
export declare class RegCtlBinaryBuilder implements RegCtlBinaryBuilderInterface {
    private readonly home;
    private readonly core;
    constructor(home: string, core: CoreInterface);
    build(version: string): RegCtlBinary;
}
