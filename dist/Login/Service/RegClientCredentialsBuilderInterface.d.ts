import { Inputs } from '../../Inputs.js';
import { RegClientCredentials } from '../../Utils/RegClient/RegClientCredentials.js';
export interface RegClientCredentialsBuilderInterface {
    build(inputs: Inputs): {
        source: RegClientCredentials;
        target: RegClientCredentials;
    };
}
