import { It, Mock } from 'moq.ts'
import { CoreInterface } from '../../../src/Utils/GitHubAction/CoreInterface.js'

export function setupMockedCoreInterface(): Mock<CoreInterface> {
  const mockedCore = new Mock<CoreInterface>()

  mockedCore.setup((core) => core.addPath(It.IsAny())).returns(undefined)
  mockedCore.setup((core) => core.error(It.IsAny())).returns(undefined)
  mockedCore
    .setup((core) => core.getInput(It.IsAny(), It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))
  mockedCore.setup((core) => core.info(It.IsAny())).returns(undefined)
  mockedCore
    .setup((core) => core.platform())
    .throws(new Error('Method mock not implemented yet.'))
  mockedCore
    .setup((core) => core.platformArch())
    .throws(new Error('Method mock not implemented yet.'))
  mockedCore.setup((core) => core.setFailed(It.IsAny())).returns(undefined)

  return mockedCore
}
