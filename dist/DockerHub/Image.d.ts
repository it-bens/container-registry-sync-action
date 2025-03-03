import { Docker } from '../Utils/Docker.js';
import { Repository } from './Repository.js';
export declare class Image {
    readonly repository: Repository;
    readonly name: string;
    readonly architecture: string;
    readonly digest: string;
    constructor(repository: Repository, name: string, architecture: string, digest: string);
    pull(docker: Docker): Promise<void>;
}
