import { Crane } from '../../Utils/Crane.js';
import { Docker } from '../../Utils/Docker.js';
import { SingleImageIndexCollection as DockerHubSingleImageIndexCollection } from '../../DockerHub/Index/SingleImageIndexCollection.js';
import { Repository } from '../Repository.js';
import { SingleImageIndex } from './SingleImageIndex.js';
export declare class SingleImageIndexCollection {
    readonly repository: Repository;
    private indices;
    constructor(repository: Repository);
    static fromDockerHubIndexCollection(repository: Repository, dockerHubIndexCollection: DockerHubSingleImageIndexCollection): SingleImageIndexCollection;
    add(index: SingleImageIndex): void;
    getImageCount(): number;
    pushAllImages(docker: Docker, crane: Crane): Promise<void>;
}
