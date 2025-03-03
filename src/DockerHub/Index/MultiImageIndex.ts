import { Docker } from '../../Utils/Docker.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'

export class MultiImageIndex {
  constructor(
    public readonly repository: Repository,
    public readonly name: string,
    public readonly digest: string,
    public readonly images: Image[]
  ) {
    if (this.images.length < 2) {
      throw new Error('A multi-image index must contain at least two images')
    }
  }

  public async pullAllImages(docker: Docker) {
    await Promise.all(this.images.map((image) => image.pull(docker)))
  }
}
