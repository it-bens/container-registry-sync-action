import { Inputs } from '../../../src/Inputs.js'
import { RegClientCredentials } from '../../../src/Utils/RegClient/RegClientCredentials.js'
import { RegClientCredentialsBuilder } from '../../../src/Login/Service/RegClientCredentialsBuilder.js'

describe('RegClientCredentialsBuilder', () => {
  let builder: RegClientCredentialsBuilder

  beforeEach(() => {
    builder = new RegClientCredentialsBuilder()
  })

  it('should build credentials for source and target repositories', () => {
    const inputs: Inputs = {
      sourceRepository: 'source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const expectedSourceCredentials: RegClientCredentials = {
      registry: null,
      username: 'sourceUser',
      password: 'sourcePass'
    }

    const expectedTargetCredentials: RegClientCredentials = {
      registry: null,
      username: 'targetUser',
      password: 'targetPass'
    }

    const credentials = builder.build(inputs)

    expect(credentials.source).toEqual(expectedSourceCredentials)
    expect(credentials.target).toEqual(expectedTargetCredentials)
  })

  it('should build credentials with registry for source and target repositories', () => {
    const inputs: Inputs = {
      sourceRepository: 'registry/source/repo',
      loginToSourceRepository: true,
      sourceRepositoryUsername: 'sourceUser',
      sourceRepositoryPassword: 'sourcePass',
      targetRepository: 'registry/target/repo',
      loginToTargetRepository: true,
      targetRepositoryUsername: 'targetUser',
      targetRepositoryPassword: 'targetPass',
      tags: 'latest'
    }

    const expectedSourceCredentials: RegClientCredentials = {
      registry: 'registry',
      username: 'sourceUser',
      password: 'sourcePass'
    }

    const expectedTargetCredentials: RegClientCredentials = {
      registry: 'registry',
      username: 'targetUser',
      password: 'targetPass'
    }

    const credentials = builder.build(inputs)

    expect(credentials.source).toEqual(expectedSourceCredentials)
    expect(credentials.target).toEqual(expectedTargetCredentials)
  })
})
