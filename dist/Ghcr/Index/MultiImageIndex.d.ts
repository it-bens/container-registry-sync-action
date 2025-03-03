import { Docker } from '../../Utils/Docker.js';
import { MultiImageIndex as DockerHubMultiImageIndex } from '../../DockerHub/Index/MultiImageIndex.js';
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js';
import { Image } from '../Image.js';
import { Repository } from '../Repository.js';
export declare class MultiImageIndex {
    readonly repository: Repository;
    readonly name: string;
    readonly images: Image[];
    private readonly dockerHubSingleImageIndexCollection;
    constructor(repository: Repository, name: string, images: Image[], dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection);
    static fromDockerHubIndex(repository: Repository, dockerHubIndex: DockerHubMultiImageIndex, dockerHubSingleImageIndexCollection: DockerHubSingleImageIndexCollection): MultiImageIndex;
    buildAndPushManifest(docker: Docker): Promise<void>;
}
