import * as exec from '@actions/exec';
export declare class Exec {
    exec(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<number>;
    getExecOutput(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<exec.ExecOutput>;
}
