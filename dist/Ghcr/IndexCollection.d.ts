import { Index } from './Index.js';
import { Repository } from './Repository.js';
import { Docker } from '../Utils/Docker.js';
import { Crane } from '../Utils/Crane.js';
export declare class IndexCollection {
    readonly repository: Repository;
    private indices;
    constructor(repository: Repository);
    add(index: Index): void;
    pushAllImages(docker: Docker, crane: Crane): Promise<void>;
    buildAndPushAllManifests(docker: Docker): Promise<void>;
}
