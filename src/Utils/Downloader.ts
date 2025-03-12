import { basename, dirname } from 'path'
import { DownloaderHelper } from 'node-downloader-helper'
import { injectable } from 'tsyringe'

@injectable()
export class Downloader {
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
      downloadHelper.on('end', () => resolve())
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
