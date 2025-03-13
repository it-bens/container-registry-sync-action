import { Inputs } from '../../Inputs.js';
import { RegClientCredentials } from '../../Utils/RegClient/RegClientCredentials.js';
import { RegClientCredentialsBuilderInterface } from './RegClientCredentialsBuilderInterface.js';
export declare class RegClientCredentialsBuilder implements RegClientCredentialsBuilderInterface {
    build(inputs: Inputs): {
        source: RegClientCredentials;
        target: RegClientCredentials;
    };
}
