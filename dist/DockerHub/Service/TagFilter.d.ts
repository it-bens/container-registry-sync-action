import { MultiImageIndexCollection } from '../Index/MultiImageIndexCollection.js';
import { SingleImageIndexCollection } from '../Index/SingleImageIndexCollection.js';
export declare class TagFilter {
    filterSingleImageIndexCollection(indexCollection: SingleImageIndexCollection, tagPattern: string): SingleImageIndexCollection;
    filterMultiImageIndexCollection(indexCollection: MultiImageIndexCollection, tagPattern: string): MultiImageIndexCollection;
    private matches;
}
