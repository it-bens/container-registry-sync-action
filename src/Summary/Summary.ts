import { Lifecycle, scoped } from 'tsyringe'
import { ImageCopyResult } from './ImageCopyResult.js'

@scoped(Lifecycle.ContainerScoped)
export class Summary {
  private installedRegCtlVersion: string | null = null
  private imageCopyResults: ImageCopyResult[] = []

  public setInstalledRegCtlVersion(version: string): void {
    this.installedRegCtlVersion = version
  }

  public addImageCopyResult(result: ImageCopyResult): void {
    this.imageCopyResults.push(result)
  }

  public getInstalledRegCtlVersion(): string {
    if (this.installedRegCtlVersion === null) {
      throw new Error('installedRegCtlVersion has not been set')
    }

    return this.installedRegCtlVersion
  }

  public getImageCopyResults(): ImageCopyResult[] {
    return this.imageCopyResults
  }
}
