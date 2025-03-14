import { CoreInterface } from '../../Utils/GitHubAction/CoreInterface.js';
import { PrinterInterface } from './PrinterInterface.js';
import { Summary } from '../Summary.js';
export declare class Printer implements PrinterInterface {
    private readonly core;
    constructor(core: CoreInterface);
    printSummary(summary: Summary): Promise<void>;
}
