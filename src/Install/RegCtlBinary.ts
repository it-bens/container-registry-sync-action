import path from 'path'

export class RegCtlBinary {
  private readonly repositoryBaseUrl = 'https://github.com/regclient/regclient'

  constructor(
    public readonly installationDirectory: string,
    public readonly version: string,
    public readonly platform: string,
    public readonly arch: string
  ) {}

  public buildDownloadUrl(): string {
    let urlWithoutBinaryName = `${this.repositoryBaseUrl}/releases/download/${this.version}`
    if (this.version === 'latest') {
      urlWithoutBinaryName = `${this.repositoryBaseUrl}/releases/latest/download`
    }

    return `${urlWithoutBinaryName}/${this.getBinaryName() + this.getBinaryExtension()}`
  }

  public getBinaryName(): string {
    switch (`${this.platform}-${this.arch}`) {
      case 'linux-x64':
        return 'regctl-linux-amd64'
      case 'linux-arm64':
        return 'regctl-linux-arm64'
      case 'darwin-x64':
        return 'regctl-darwin-amd64'
      case 'darwin-arm64':
        return 'regctl-darwin-arm64'
      case 'win32-x64':
        return 'regctl-windows-amd64'
      default:
        throw new Error(
          `Unsupported platform/arch: ${this.platform}/${this.arch}`
        )
    }
  }

  public getInstallationPath(): string {
    return path.join(
      this.installationDirectory,
      'regctl' + this.getBinaryExtension()
    )
  }

  private getBinaryExtension(): string {
    return this.platform === 'win32' ? '.exe' : ''
  }
}
