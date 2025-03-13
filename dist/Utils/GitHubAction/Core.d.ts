import * as core from '@actions/core';
import { CoreInterface } from './CoreInterface.js';
export declare class Core implements CoreInterface {
    addPath(inputPath: string): void;
    error(message: string): void;
    getInput(name: string, options?: core.InputOptions): string;
    info(message: string): void;
    platform(): string;
    platformArch(): string;
    setFailed(message: string): void;
}
