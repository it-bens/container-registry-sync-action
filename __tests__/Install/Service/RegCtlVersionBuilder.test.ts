import { It, Mock } from 'moq.ts'
import { ExecInterface } from '../../../src/Utils/GitHubAction/ExecInterface.js'
import { ExecOutput } from '@actions/exec'
import { RegCtlVersion } from '../../../src/Install/RegCtlVersion.js'
import { RegCtlVersionBuilder } from '../../../src/Install/Service/RegCtlVersionBuilder.js'
import _ from 'lodash'
import { setupMockedExecInterface } from '../../../__fixtures__/Utils/GitHubAction/setupMockedExecInterface.js'

describe('RegCtlVersionBuilder', () => {
  let mockedExec: Mock<ExecInterface>
  let regCtlVersionBuilder: RegCtlVersionBuilder

  beforeEach(() => {
    mockedExec = setupMockedExecInterface()
    regCtlVersionBuilder = new RegCtlVersionBuilder(mockedExec.object())
  })

  it('should build RegCtlVersion with correct properties', async () => {
    const execOutput: ExecOutput = {
      stderr: '',
      exitCode: 0,
      stdout:
        'VCSTag:     v1.0.0\n' +
        'VCSRef:     abc123\n' +
        'VCSCommit:  def456\n' +
        'VCSState:   clean\n' +
        'VCSDate:    2023-10-01\n' +
        'Platform:   linux\n' +
        'GoVer:      go1.18\n' +
        'GoCompiler: gc'
    }
    mockedExec
      .setup((exec) =>
        exec.getExecOutput(
          'regctl',
          It.Is((value) => _.isEqual(['version'], value))
        )
      )
      .returnsAsync(execOutput)

    const regCtlVersion: RegCtlVersion =
      await regCtlVersionBuilder.buildFromExecOutput()

    expect(regCtlVersion.vcsTag).toBe('v1.0.0')
    expect(regCtlVersion.vcsRef).toBe('abc123')
    expect(regCtlVersion.vcsCommit).toBe('def456')
    expect(regCtlVersion.vcsState).toBe('clean')
    expect(regCtlVersion.vcsDate).toBe('2023-10-01')
    expect(regCtlVersion.platform).toBe('linux')
    expect(regCtlVersion.goVersion).toBe('go1.18')
    expect(regCtlVersion.goCompiler).toBe('gc')
  })

  it('should throw an error if the output has an unexpected number of lines', async () => {
    const execOutput = {
      stderr: '',
      exitCode: 0,
      stdout: 'VCSTag:     v1.0.0\n' + 'VCSRef:     abc123\n'
    }
    mockedExec
      .setup((exec) =>
        exec.getExecOutput(
          'regctl',
          It.Is((value) => _.isEqual(['version'], value))
        )
      )
      .returnsAsync(execOutput)

    await expect(regCtlVersionBuilder.buildFromExecOutput()).rejects.toThrow(
      'Unexpected number of lines in regctl version output. Expected 8, got 2'
    )
  })
})
