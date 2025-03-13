export interface DownloaderInterface {
  downloadFile(fileUrl: string, destination: string): Promise<void>
}
