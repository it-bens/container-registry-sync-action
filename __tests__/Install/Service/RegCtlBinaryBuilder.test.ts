import { Core } from '../../../src/Utils/GitHubAction/Core.js'
import { RegCtlBinary } from '../../../src/Install/RegCtlBinary.js'
import { RegCtlBinaryBuilder } from '../../../src/Install/Service/RegCtlBinaryBuilder.js'
import { jest } from '@jest/globals'

const mockedCore = new Core() as jest.Mocked<Core>
mockedCore.platform = jest.fn() as jest.MockedFunction<
  typeof Core.prototype.platform
>
mockedCore.platformArch = jest.fn() as jest.MockedFunction<
  typeof Core.prototype.platformArch
>

describe('RegCtlBinaryBuilder', () => {
  let regCtlBinaryBuilder: RegCtlBinaryBuilder

  beforeEach(() => {
    jest.clearAllMocks()

    regCtlBinaryBuilder = new RegCtlBinaryBuilder('/home/user', mockedCore)
  })

  it('should build RegCtlBinary with correct properties', () => {
    mockedCore.platform.mockReturnValue('linux')
    mockedCore.platformArch.mockReturnValue('x64')

    const version = 'latest'
    const regCtlBinary = regCtlBinaryBuilder.build(version)

    expect(regCtlBinary).toBeInstanceOf(RegCtlBinary)
    expect(regCtlBinary.installationDirectory).toBe('/home/user/.regctl/bin')
    expect(regCtlBinary.version).toBe(version)
    expect(regCtlBinary.platform).toBe('linux')
    expect(regCtlBinary.arch).toBe('x64')
  })
})
