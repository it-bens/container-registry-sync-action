import { Client } from '../../Ghcr/Service/Client.js';
import { SingleImageIndexCollection } from '../Index/SingleImageIndexCollection.js';
export declare class IndexFilterAgainstGhcrInformation {
    private readonly ghcrClient;
    constructor(ghcrClient: Client);
    withoutIndicesThatAreUpToDate(indices: SingleImageIndexCollection, ghcrRepository: string): Promise<SingleImageIndexCollection>;
}
