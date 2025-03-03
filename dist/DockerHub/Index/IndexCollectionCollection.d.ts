import { MultiImageIndexCollection } from './MultiImageIndexCollection.js';
import { SingleImageIndexCollection } from './SingleImageIndexCollection.js';
export declare class IndexCollectionCollection {
    readonly singleImageIndexCollection: SingleImageIndexCollection;
    readonly multiImageIndexCollection: MultiImageIndexCollection;
    constructor(singleImageIndexCollection: SingleImageIndexCollection, multiImageIndexCollection: MultiImageIndexCollection);
}
