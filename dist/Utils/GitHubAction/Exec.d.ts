import * as exec from '@actions/exec';
import { ExecInterface } from './ExecInterface.js';
export declare class Exec implements ExecInterface {
    exec(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<number>;
    getExecOutput(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<exec.ExecOutput>;
}
