import { IoInterface } from './IoInterface.js';
export declare class Io implements IoInterface {
    mkdirP(path: string): Promise<void>;
}
