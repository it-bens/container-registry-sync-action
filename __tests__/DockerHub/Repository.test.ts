import { Repository } from '../../src/DockerHub/Repository.js'

describe('DockerHub/Repository', () => {
  it('should correctly initialize properties in the constructor', () => {
    const repository = new Repository('testOrg', 'testRepo')

    expect(repository.organisation).toBe('testOrg')
    expect(repository.name).toBe('testRepo')
  })

  it('should return the repository name including the organisation', () => {
    const repository = new Repository('testOrg', 'testRepo')

    expect(repository.repository()).toBe('testOrg/testRepo')
  })
})
