import { Lifecycle, inject, scoped } from 'tsyringe'
import { CoreInterface } from '../Utils/GitHubAction/CoreInterface.js'
import { DownloaderInterface } from '../Utils/DownloaderInterface.js'
import { ExecInterface } from '../Utils/GitHubAction/ExecInterface.js'
import { IoInterface } from '../Utils/GitHubAction/IoInterface.js'
import { LoggerInterface } from '../Utils/LoggerInterface.js'
import { RegCtlBinaryBuilderInterface } from './Service/RegCtlBinaryBuilderInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Action {
  constructor(
    @inject('RegCtlBinaryBuilderInterface')
    private readonly regCtlBinaryBuilder: RegCtlBinaryBuilderInterface,
    @inject('IoInterface')
    private readonly io: IoInterface,
    @inject('DownloaderInterface')
    private readonly downloader: DownloaderInterface,
    @inject('ExecInterface')
    private readonly exec: ExecInterface,
    @inject('CoreInterface')
    private readonly core: CoreInterface,
    @inject('LoggerInterface')
    private readonly logger: LoggerInterface
  ) {}

  async run(): Promise<void> {
    const regCtlBinary = this.regCtlBinaryBuilder.build('latest')

    await this.io.mkdirP(regCtlBinary.installationDirectory)

    try {
      await this.exec.exec('rm', [regCtlBinary.getInstallationPath()])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      this.logger.logRegCtlNotInstalledYet()
    }

    await this.downloader.downloadFile(
      regCtlBinary.buildDownloadUrl(),
      regCtlBinary.getInstallationPath()
    )
    await this.exec.exec('chmod', ['+x', regCtlBinary.getInstallationPath()])
    this.logger.logRegCtlInstalled(
      regCtlBinary.getInstallationPath(),
      regCtlBinary.version
    )

    this.core.addPath(regCtlBinary.installationDirectory)

    await this.exec.exec('regctl', ['version'])
  }

  async post(): Promise<void> {
    const regCtlBinary = this.regCtlBinaryBuilder.build('latest')
    try {
      await this.exec.exec('rm', [regCtlBinary.getInstallationPath()])
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      this.logger.logRegCtlCouldNotBeDeleted(regCtlBinary.getInstallationPath())
    }
  }
}
