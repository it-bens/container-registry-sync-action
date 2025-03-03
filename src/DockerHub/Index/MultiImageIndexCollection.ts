import { Docker } from '../../Utils/Docker.js'
import { MultiImageIndex } from './MultiImageIndex.js'
import { Repository } from '../Repository.js'

export class MultiImageIndexCollection {
  public length: number = 0
  private indices: MultiImageIndex[] = []

  constructor(public readonly repository: Repository) {}

  public add(index: MultiImageIndex) {
    this.indices.push(index)
    this.length = this.indices.length
  }

  public all(): MultiImageIndex[] {
    return this.indices
  }

  public async pullAllImages(docker: Docker) {
    await Promise.all(this.indices.map((index) => index.pullAllImages(docker)))
  }
}
