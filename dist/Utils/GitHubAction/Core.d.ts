import * as core from '@actions/core';
export declare class Core {
    addPath(inputPath: string): void;
    error(message: string): void;
    getInput(name: string, options?: core.InputOptions): string;
    info(message: string): void;
    platform(): string;
    platformArch(): string;
    setFailed(message: string): void;
}
