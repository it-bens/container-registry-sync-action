import { TagSorter } from '../../src/Utils/TagSorter.js'

describe('TagSorter', () => {
  let tagSorter: TagSorter

  beforeEach(() => {
    tagSorter = new TagSorter()
  })

  it('should sort tags by semantic versioning including architecture', () => {
    const tags = ['6.6.10', '6.6.10-amd64', '6.6.10-arm64']
    const result = tagSorter.sortTags(tags)
    expect(result).toEqual(['6.6.10-amd64', '6.6.10-arm64', '6.6.10'])
  })

  it('should sort tags by semantic versioning (+ 4th part) including architecture', () => {
    const tags = [
      '6.6.10.1-amd64',
      '6.6.10.0-arm64',
      '6.6.10.1',
      '6.6.10.0-amd64',
      '6.6.10.1-arm64',
      '6.6.10.0'
    ]
    const result = tagSorter.sortTags(tags)
    expect(result).toEqual([
      '6.6.10.0-amd64',
      '6.6.10.0-arm64',
      '6.6.10.0',
      '6.6.10.1-amd64',
      '6.6.10.1-arm64',
      '6.6.10.1'
    ])
  })
})
