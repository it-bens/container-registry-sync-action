import { MultiImageIndexCollection } from './MultiImageIndexCollection.js'
import { SingleImageIndexCollection } from './SingleImageIndexCollection.js'

export class IndexCollectionCollection {
  constructor(
    public readonly singleImageIndexCollection: SingleImageIndexCollection,
    public readonly multiImageIndexCollection: MultiImageIndexCollection
  ) {}
}
