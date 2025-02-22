import { Docker } from '../../Utils/Docker.js'
import { Image } from '../Image.js'
import { Repository } from '../Repository.js'
import { SingleImageIndex } from './SingleImageIndex.js'

export class SingleImageIndexCollection {
  public length: number = 0
  private indices: SingleImageIndex[] = []

  constructor(public readonly repository: Repository) {}

  public add(index: SingleImageIndex) {
    this.indices.push(index)
    this.length = this.indices.length
  }

  public all(): SingleImageIndex[] {
    return this.indices
  }

  public allImages(): Image[] {
    return this.indices.flatMap((index) => index.image)
  }

  public async pullAllImages(docker: Docker) {
    await Promise.all(this.indices.map((index) => index.pullImage(docker)))
  }
}
