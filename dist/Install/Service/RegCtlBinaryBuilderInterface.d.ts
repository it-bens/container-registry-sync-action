import { RegCtlBinary } from '../RegCtlBinary.js';
export interface RegCtlBinaryBuilderInterface {
    build(version: string): RegCtlBinary;
}
