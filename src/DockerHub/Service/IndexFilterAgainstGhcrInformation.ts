import { Lifecycle, inject, scoped } from 'tsyringe'
import { Client } from '../../Ghcr/Service/Client.js'
import { SingleImageIndexCollection } from '../Index/SingleImageIndexCollection.js'

@scoped(Lifecycle.ContainerScoped)
export class IndexFilterAgainstGhcrInformation {
  constructor(
    @inject(Client)
    private readonly ghcrClient: Client
  ) {}

  public async withoutIndicesThatAreUpToDate(
    indices: SingleImageIndexCollection,
    ghcrRepository: string
  ): Promise<SingleImageIndexCollection> {
    const filteredIndexCollection = new SingleImageIndexCollection(
      indices.repository
    )

    await Promise.all(
      indices.all().map(async (index) => {
        const dockerHubDigestInGhcr: string | null =
          await this.ghcrClient.fetchOriginalDockerHubDigest(
            ghcrRepository,
            index.name
          )

        if (
          dockerHubDigestInGhcr === null ||
          dockerHubDigestInGhcr !== index.digest
        ) {
          filteredIndexCollection.add(index)
        }
      })
    )

    return filteredIndexCollection
  }
}
