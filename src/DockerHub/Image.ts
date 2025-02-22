import { Docker } from '../Utils/Docker.js'
import { Repository } from './Repository.js'

export class Image {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly architecture: string,
    public readonly digest: string
  ) {}

  public async pull(docker: Docker) {
    await docker.pull(
      this.repository.repository(),
      this.name,
      this.architecture
    )
  }
}
