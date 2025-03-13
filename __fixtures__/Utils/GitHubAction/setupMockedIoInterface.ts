import { It, Mock } from 'moq.ts'
import { IoInterface } from '../../../src/Utils/GitHubAction/IoInterface.js'

export function setupMockedIoInterface(): Mock<IoInterface> {
  const mockedIo = new Mock<IoInterface>()

  mockedIo.setup((io) => io.mkdirP(It.IsAny())).returnsAsync(undefined)

  return mockedIo
}
