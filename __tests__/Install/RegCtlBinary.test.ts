import { RegCtlBinary } from '../../src/Install/RegCtlBinary.js'

describe('RegCtlBinary', () => {
  const installationDirectory = '/home/user/.regctl/bin'
  const version = 'latest'
  const platform = 'linux'
  const arch = 'x64'

  let regCtlBinary: RegCtlBinary

  beforeEach(() => {
    regCtlBinary = new RegCtlBinary(
      installationDirectory,
      version,
      platform,
      arch
    )
  })

  it('should build the correct download URL for the latest version', () => {
    const expectedUrl =
      'https://github.com/regclient/regclient/releases/latest/download/regctl-linux-amd64'
    expect(regCtlBinary.buildDownloadUrl()).toBe(expectedUrl)
  })

  it('should build the correct download URL for a specific version', () => {
    const specificVersion = 'v0.3.0'
    regCtlBinary = new RegCtlBinary(
      installationDirectory,
      specificVersion,
      platform,
      arch
    )
    const expectedUrl =
      'https://github.com/regclient/regclient/releases/download/v0.3.0/regctl-linux-amd64'
    expect(regCtlBinary.buildDownloadUrl()).toBe(expectedUrl)
  })

  it('should return the correct binary name for linux-x64', () => {
    expect(regCtlBinary.getBinaryName()).toBe('regctl-linux-amd64')
  })

  it('should return the correct installation path', () => {
    const expectedPath = '/home/user/.regctl/bin/regctl'
    expect(regCtlBinary.getInstallationPath()).toBe(expectedPath)
  })

  it('should return the correct binary extension for non-Windows platforms', () => {
    expect(regCtlBinary['getBinaryExtension']()).toBe('')
  })

  it('should return the correct binary extension for Windows platform', () => {
    regCtlBinary = new RegCtlBinary(
      installationDirectory,
      version,
      'win32',
      arch
    )
    expect(regCtlBinary['getBinaryExtension']()).toBe('.exe')
  })

  it('should throw an error for unsupported platform/arch', () => {
    regCtlBinary = new RegCtlBinary(
      installationDirectory,
      version,
      'unsupported',
      'arch'
    )
    expect(() => regCtlBinary.getBinaryName()).toThrow(
      'Unsupported platform/arch: unsupported/arch'
    )
  })
})
