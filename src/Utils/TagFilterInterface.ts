export interface TagFilterInterface {
  filter(tags: string[], tagPattern: string): string[]
}
