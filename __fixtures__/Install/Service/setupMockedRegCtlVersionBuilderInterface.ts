import { Mock } from 'moq.ts'
import { RegCtlVersionBuilderInterface } from '../../../src/Install/Service/RegCtlVersionBuilderInterface.js'

export function setupMockedRegCtlVersionBuilderInterface(): Mock<RegCtlVersionBuilderInterface> {
  const mockedRegCtlVersionBuilder = new Mock<RegCtlVersionBuilderInterface>()

  mockedRegCtlVersionBuilder
    .setup((regCtlVersionBuilder) => regCtlVersionBuilder.buildFromExecOutput())
    .throws(new Error('Method mock not implemented yet.'))

  return mockedRegCtlVersionBuilder
}
