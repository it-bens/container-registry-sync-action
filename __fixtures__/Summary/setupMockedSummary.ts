import { It, Mock } from 'moq.ts'
import { Summary } from '../../src/Summary/Summary.js'

export function setupMockedSummary(): Mock<Summary> {
  const mockedSummary = new Mock<Summary>()

  mockedSummary
    .setup((mockedSummary) => mockedSummary.addImageCopyResult(It.IsAny()))
    .returns(undefined)
  mockedSummary
    .setup((mockedSummary) =>
      mockedSummary.setInstalledRegCtlVersion(It.IsAny())
    )
    .returns(undefined)

  return mockedSummary
}
