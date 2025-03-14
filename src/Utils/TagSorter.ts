import { Lifecycle, scoped } from 'tsyringe'
import { TagSorterInterface } from './TagSorterInterface.js'
import { registerInterface } from '../DependencyInjection/Decorator/register-interface.js'

@scoped(Lifecycle.ContainerScoped)
@registerInterface('TagSorterInterface', Lifecycle.ContainerScoped)
export class TagSorter implements TagSorterInterface {
  public sortTags(tags: string[]): string[] {
    // Group tags by their full version
    const groups = tags.reduce(
      (acc, tag) => {
        const baseVersion = tag.split('-')[0]
        if (!acc[baseVersion]) {
          acc[baseVersion] = []
        }
        acc[baseVersion].push(tag)
        return acc
      },
      {} as Record<string, string[]>
    )

    // Sort each group: suffixes first, no suffix last
    for (const baseVersion in groups) {
      groups[baseVersion].sort((a, b) => {
        const aHasSuffix = a.includes('-')
        const bHasSuffix = b.includes('-')
        if (aHasSuffix && !bHasSuffix) return -1
        if (!aHasSuffix && bHasSuffix) return 1
        return a.localeCompare(b)
      })
    }

    // Sort groups by full version
    const sortedGroups = Object.keys(groups).sort((a, b) => {
      if (a === 'latest') return 1
      if (b === 'latest') return -1
      return a.localeCompare(b, undefined, { numeric: true })
    })

    // Flatten sorted groups into a single array
    return sortedGroups.flatMap((baseVersion) => groups[baseVersion])
  }
}
