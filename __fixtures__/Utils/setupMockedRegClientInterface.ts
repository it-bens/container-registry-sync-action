import { It, Mock } from 'moq.ts'
import { RegClientInterface } from '../../src/Utils/RegClientInterface.js'

export function setupMockedRegClientInterface(): Mock<RegClientInterface> {
  const mockedRegClient = new Mock<RegClientInterface>()

  mockedRegClient
    .setup((regClient) => regClient.listTagsInRepository(It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))
  mockedRegClient
    .setup((regClient) => regClient.logIntoRegistry(It.IsAny()))
    .returnsAsync(undefined)
  mockedRegClient
    .setup((regClient) => regClient.logoutFromRegistry(It.IsAny()))
    .returnsAsync(undefined)
  mockedRegClient
    .setup((regClient) =>
      regClient.copyImageFromSourceToTarget(
        It.IsAny(),
        It.IsAny(),
        It.IsAny(),
        It.IsAny()
      )
    )
    .returnsAsync(undefined)

  return mockedRegClient
}
