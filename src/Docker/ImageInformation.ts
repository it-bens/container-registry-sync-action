export interface ImageInformation {
  Id: string
  RepoTags: string[]
  RepoDigests: string[]
  Config: {
    Labels?: {
      [key: string]: string
    }
  }
  Architecture: string
  Os: string
}
