import { inject, injectable } from 'tsyringe'
import { Core } from '../Utils/GitHubAction/Core.js'
import { Downloader } from '../Utils/Downloader.js'
import { Exec } from '../Utils/GitHubAction/Exec.js'
import { Io } from '../Utils/GitHubAction/Io.js'
import { Logger } from '../Utils/Logger.js'
import { RegCtlBinaryBuilder } from './Service/RegCtlBinaryBuilder.js'

@injectable()
export class Action {
  constructor(
    @inject(RegCtlBinaryBuilder)
    private readonly regCtlBinaryBuilder: RegCtlBinaryBuilder,
    @inject(Io)
    private readonly io: Io,
    @inject(Downloader)
    private readonly downloader: Downloader,
    @inject(Exec)
    private readonly exec: Exec,
    @inject(Core)
    private readonly core: Core,
    @inject(Logger)
    private readonly logger: Logger
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
