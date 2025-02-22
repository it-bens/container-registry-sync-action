import { MultiImageIndex } from '../Index/MultiImageIndex.js'
import { MultiImageIndexCollection } from '../Index/MultiImageIndexCollection.js'
import { SingleImageIndex } from '../Index/SingleImageIndex.js'
import { SingleImageIndexCollection } from '../Index/SingleImageIndexCollection.js'
import { minimatch } from 'minimatch'

export class TagFilter {
  public filterSingleImageIndexCollection(
    indexCollection: SingleImageIndexCollection,
    tagPattern: string
  ): SingleImageIndexCollection {
    const filteredCollection = new SingleImageIndexCollection(
      indexCollection.repository
    )

    for (const index of indexCollection.all()) {
      if (this.matches(index, tagPattern)) {
        filteredCollection.add(index)
      }
    }

    return filteredCollection
  }

  public filterMultiImageIndexCollection(
    indexCollection: MultiImageIndexCollection,
    tagPattern: string
  ): MultiImageIndexCollection {
    const filteredCollection = new MultiImageIndexCollection(
      indexCollection.repository
    )

    for (const index of indexCollection.all()) {
      if (this.matches(index, tagPattern)) {
        filteredCollection.add(index)
      }
    }

    return filteredCollection
  }

  private matches(
    index: SingleImageIndex | MultiImageIndex,
    tagPattern: string
  ): boolean {
    return minimatch(index.name, tagPattern, { dot: true })
  }
}
