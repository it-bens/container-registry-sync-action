import { Crane } from '../../Utils/Crane.js';
import { Docker } from '../../Utils/Docker.js';
import { SingleImageIndex as DockerHubSingleImageIndex } from '../../DockerHub/Index/SingleImageIndex.js';
import { Image } from '../Image.js';
import { Repository } from '../Repository.js';
export declare class SingleImageIndex {
    readonly repository: Repository;
    readonly name: string;
    readonly image: Image;
    constructor(repository: Repository, name: string, image: Image);
    static fromDockerHubIndex(repository: Repository, dockerHubIndex: DockerHubSingleImageIndex): SingleImageIndex;
    pushImage(docker: Docker, crane: Crane): Promise<void>;
}
