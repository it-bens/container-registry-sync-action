import { TagFilter } from '../../src/Utils/TagFilter.js'

describe('TagFilter', () => {
  let tagFilter: TagFilter

  beforeEach(() => {
    tagFilter = new TagFilter()
  })

  it('should filter tags by pattern', () => {
    const tags = ['v1.0.0', 'v1.1.0', 'latest', 'v2.0.0']
    const pattern = 'v1.*'
    const result = tagFilter.filter(tags, pattern)
    expect(result).toEqual(['v1.0.0', 'v1.1.0'])
  })

  it('should filter tags by exact match', () => {
    const tags = ['v1.0.0', 'v1.1.0', 'latest', 'v2.0.0']
    const pattern = 'latest'
    const result = tagFilter.filter(tags, pattern)
    expect(result).toEqual(['latest'])
  })

  it('should filter tags by wildcard pattern', () => {
    const tags = ['v1.0.0', 'v1.1.0', 'latest', 'v2.0.0']
    const pattern = '*.*.0'
    const result = tagFilter.filter(tags, pattern)
    expect(result).toEqual(['v1.0.0', 'v1.1.0', 'v2.0.0'])
  })
})
