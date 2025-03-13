import { It, Mock } from 'moq.ts'
import { DownloaderInterface } from '../../src/Utils/DownloaderInterface.js'

export function setupMockedDownloaderInterface(): Mock<DownloaderInterface> {
  const mockedDownloader = new Mock<DownloaderInterface>()

  mockedDownloader
    .setup((downloader) => downloader.downloadFile(It.IsAny(), It.IsAny()))
    .returnsAsync(undefined)

  return mockedDownloader
}
