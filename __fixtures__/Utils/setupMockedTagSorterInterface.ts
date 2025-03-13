import { It, Mock } from 'moq.ts'
import { TagSorterInterface } from '../../src/Utils/TagSorterInterface.js'

export function setupMockedTagSorterInterface(): Mock<TagSorterInterface> {
  const mockedTagSorter = new Mock<TagSorterInterface>()

  mockedTagSorter
    .setup((tagSorter) => tagSorter.sortTags(It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))

  return mockedTagSorter
}
