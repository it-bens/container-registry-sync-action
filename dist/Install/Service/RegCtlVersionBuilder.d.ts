import { ExecInterface } from '../../Utils/GitHubAction/ExecInterface.js';
import { RegCtlVersion } from '../RegCtlVersion.js';
import { RegCtlVersionBuilderInterface } from './RegCtlVersionBuilderInterface.js';
export declare class RegCtlVersionBuilder implements RegCtlVersionBuilderInterface {
    private readonly exec;
    private readonly lineDelimiter;
    private readonly expectedLineCount;
    private readonly keyStringLength;
    constructor(exec: ExecInterface);
    buildFromExecOutput(): Promise<RegCtlVersion>;
    private extractValueFromLine;
}
