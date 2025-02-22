export interface Manifest {
  schemaVersion: number
  mediaType: string
  config: {
    mediaType: string
    size: number
    digest: string
  }
  layers: {
    mediaType: string
    size: number
    digest: string
  }[]
  labels?: {
    [key: string]: string
  }
  annotations?: {
    [key: string]: string
  }
}
