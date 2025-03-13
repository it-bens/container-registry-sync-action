import { It, Mock } from 'moq.ts'
import { RegClientCredentialsBuilderInterface } from '../../../src/Login/Service/RegClientCredentialsBuilderInterface.js'

export function setupMockedRegClientCredentialsBuilderInterface(): Mock<RegClientCredentialsBuilderInterface> {
  const mockedRegClientCredentialsBuilder =
    new Mock<RegClientCredentialsBuilderInterface>()

  mockedRegClientCredentialsBuilder
    .setup((builder) => builder.build(It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))

  return mockedRegClientCredentialsBuilder
}
