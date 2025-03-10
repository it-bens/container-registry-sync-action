import * as core from '@actions/core';
export declare class Core {
    getInput(name: string, options?: core.InputOptions): string;
    info(message: string): void;
    setFailed(message: string): void;
}
