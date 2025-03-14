import { Lifecycle, inject, scoped } from 'tsyringe'
import { basename, dirname } from 'path'
import { DownloaderHelper } from 'node-downloader-helper'
import { DownloaderInterface } from './DownloaderInterface.js'
import { LoggerInterface } from './LoggerInterface.js'
import { registerInterface } from '../DependencyInjection/Decorator/register-interface.js'

@scoped(Lifecycle.ContainerScoped)
@registerInterface('DownloaderInterface', Lifecycle.ContainerScoped)
export class Downloader implements DownloaderInterface {
  constructor(
    @inject('LoggerInterface')
    private readonly logger: LoggerInterface
  ) {}

  public async downloadFile(
    fileUrl: string,
    destination: string
  ): Promise<void> {
    const directory = dirname(destination)
    const filename = basename(destination)

    const downloadHelper = new DownloaderHelper(fileUrl, directory, {
      fileName: filename,
      override: true
    })

    return new Promise((resolve, reject) => {
      downloadHelper.on('end', () => {
        this.logger.logRegCtlDownloaded(fileUrl, directory)
        resolve()
      })
      downloadHelper.on('error', (err) => {
        reject(
          new Error(
            `The download of ${filename} from ${fileUrl} failed: ${err.message} (status: ${err.status})`
          )
        )
      })
      downloadHelper.start().catch(reject)
    })
  }
}
