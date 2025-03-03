import { Docker } from '../Utils/Docker.js';
import { Index } from './Index.js';
import { Repository } from './Repository.js';
export declare class IndexCollection {
    readonly repository: Repository;
    private indices;
    constructor(repository: Repository);
    add(index: Index): void;
    all(): Index[];
    pullAllImages(docker: Docker): Promise<void>;
}
