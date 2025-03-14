import { It, Mock } from 'moq.ts'
import { RegCtlBinaryBuilderInterface } from '../../../src/Install/Service/RegCtlBinaryBuilderInterface.js'

export function setupMockedRegCtlBinaryBuilderInterface(): Mock<RegCtlBinaryBuilderInterface> {
  const mockedRegCtlBinaryBuilder = new Mock<RegCtlBinaryBuilderInterface>()
  mockedRegCtlBinaryBuilder
    .setup((regCtlBinaryBuilder) => regCtlBinaryBuilder.build(It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))

  return mockedRegCtlBinaryBuilder
}
