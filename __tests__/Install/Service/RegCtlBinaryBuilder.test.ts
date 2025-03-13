import { CoreInterface } from '../../../src/Utils/GitHubAction/CoreInterface.js'
import { Mock } from 'moq.ts'
import { RegCtlBinary } from '../../../src/Install/RegCtlBinary.js'
import { RegCtlBinaryBuilder } from '../../../src/Install/Service/RegCtlBinaryBuilder.js'
import { setupMockedCoreInterface } from '../../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'

describe('RegCtlBinaryBuilder', () => {
  let mockedCore: Mock<CoreInterface>
  let regCtlBinaryBuilder: RegCtlBinaryBuilder

  beforeEach(() => {
    mockedCore = setupMockedCoreInterface()

    regCtlBinaryBuilder = new RegCtlBinaryBuilder(
      '/home/user',
      mockedCore.object()
    )
  })

  it('should build RegCtlBinary with correct properties', () => {
    mockedCore.setup((core) => core.platform()).returns('linux')
    mockedCore.setup((core) => core.platformArch()).returns('x64')

    const version = 'latest'
    const regCtlBinary = regCtlBinaryBuilder.build(version)

    expect(regCtlBinary).toBeInstanceOf(RegCtlBinary)
    expect(regCtlBinary.installationDirectory).toBe('/home/user/.regctl/bin')
    expect(regCtlBinary.version).toBe(version)
    expect(regCtlBinary.platform).toBe('linux')
    expect(regCtlBinary.arch).toBe('x64')
  })
})
