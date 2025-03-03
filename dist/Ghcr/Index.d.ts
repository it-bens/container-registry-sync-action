import { Crane } from '../Utils/Crane.js';
import { Docker } from '../Utils/Docker.js';
import { Image } from './Image.js';
import { Repository } from './Repository.js';
export declare class Index {
    readonly repository: Repository;
    readonly name: string;
    readonly images: Image[];
    constructor(repository: Repository, name: string, images: Image[]);
    pushAllImages(docker: Docker, crane: Crane): Promise<void>;
    buildAndPushManifest(docker: Docker): Promise<void>;
}
