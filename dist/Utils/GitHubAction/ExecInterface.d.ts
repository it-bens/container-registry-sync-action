import * as exec from '@actions/exec';
export interface ExecInterface {
    exec(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<number>;
    getExecOutput(commandLine: string, args?: string[], options?: exec.ExecOptions): Promise<exec.ExecOutput>;
}
