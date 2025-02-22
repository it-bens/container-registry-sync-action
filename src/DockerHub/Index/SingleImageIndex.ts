import { Docker } from '../../Utils/Docker.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'

export class SingleImageIndex {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly digest: string,
    public readonly image: Image
  ) {}

  public async pullImage(docker: Docker) {
    await this.image.pull(docker)
  }
}
