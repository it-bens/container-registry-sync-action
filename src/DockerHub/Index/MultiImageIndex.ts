import { Docker } from '../../Utils/Docker.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'

export class MultiImageIndex {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly digest: string,
    public readonly images: Image[]
  ) {}

  public async pullAllImages(docker: Docker) {
    await Promise.all(this.images.map((image) => image.pull(docker)))
  }
}
