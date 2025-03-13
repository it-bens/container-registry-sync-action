import { It, Mock } from 'moq.ts'
import { TagFilterInterface } from '../../src/Utils/TagFilterInterface.js'

export function setupMockedTagFilterInterface(): Mock<TagFilterInterface> {
  const mockedTagFilter = new Mock<TagFilterInterface>()

  mockedTagFilter
    .setup((tagFilter) => tagFilter.filter(It.IsAny(), It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))

  return mockedTagFilter
}
