import { Docker } from '../Utils/Docker.js';
import { Image } from './Image.js';
import { Repository } from './Repository.js';
export declare class Index {
    readonly repository: Repository;
    readonly name: string;
    readonly digest: string;
    readonly images: Image[];
    constructor(repository: Repository, name: string, digest: string, images: Image[]);
    pullAllImages(docker: Docker): Promise<void>;
}
