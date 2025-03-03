import { IndexCollectionCollection } from '../../../src/DockerHub/Index/IndexCollectionCollection.js'
import { MultiImageIndexCollection } from '../../../src/DockerHub/Index/MultiImageIndexCollection.js'
import { Repository } from '../../../src/DockerHub/Repository.js'
import { SingleImageIndexCollection } from '../../../src/DockerHub/Index/SingleImageIndexCollection.js'

describe('DockerHub/IndexCollectionCollection', () => {
  it('should correctly initialize properties in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')
    const singleImageIndexCollection = new SingleImageIndexCollection(
      repository
    )
    const multiImageIndexCollection = new MultiImageIndexCollection(repository)
    const indexCollectionCollection = new IndexCollectionCollection(
      singleImageIndexCollection,
      multiImageIndexCollection
    )

    expect(indexCollectionCollection.singleImageIndexCollection).toBe(
      singleImageIndexCollection
    )
    expect(indexCollectionCollection.multiImageIndexCollection).toBe(
      multiImageIndexCollection
    )
  })
})
