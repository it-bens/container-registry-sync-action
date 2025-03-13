import { Lifecycle, scoped } from 'tsyringe'
import { TagFilterInterface } from './TagFilterInterface.js'
import { minimatch } from 'minimatch'

@scoped(Lifecycle.ContainerScoped)
export class TagFilter implements TagFilterInterface {
  public filter(tags: string[], tagPattern: string): string[] {
    return tags.filter((tag) => {
      return minimatch(tag, tagPattern, { dot: true })
    })
  }
}
