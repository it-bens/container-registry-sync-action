import { IndexBuilder } from './IndexBuilder.js';
import { IndexCollectionCollection } from '../Index/IndexCollectionCollection.js';
export declare class Client {
    private readonly indexBuilder;
    private readonly urlTemplate;
    constructor(indexBuilder: IndexBuilder);
    fetchIndices(organisationName: string, repositoryName: string): Promise<IndexCollectionCollection>;
    private fetchPageCount;
    private fetchTagPage;
}
