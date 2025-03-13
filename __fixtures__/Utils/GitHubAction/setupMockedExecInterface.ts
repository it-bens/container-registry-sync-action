import { It, Mock } from 'moq.ts'
import { ExecInterface } from '../../../src/Utils/GitHubAction/ExecInterface.js'

export function setupMockedExecInterface(): Mock<ExecInterface> {
  const mockedExec = new Mock<ExecInterface>()

  mockedExec
    .setup((exec) => exec.exec(It.IsAny(), It.IsAny(), It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))
  mockedExec
    .setup((exec) => exec.getExecOutput(It.IsAny(), It.IsAny(), It.IsAny()))
    .throws(new Error('Method mock not implemented yet.'))

  return mockedExec
}
