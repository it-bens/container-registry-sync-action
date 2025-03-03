import { Lifecycle, scoped } from 'tsyringe'
import { minimatch } from 'minimatch'

@scoped(Lifecycle.ContainerScoped)
export class TagFilter {
  public filter(tags: string[], tagPattern: string): string[] {
    return tags.filter((tag) => {
      return minimatch(tag, tagPattern, { dot: true })
    })
  }
}
