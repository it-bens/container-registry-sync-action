import { Docker } from '../../Utils/Docker.js';
import { MultiImageIndex } from './MultiImageIndex.js';
import { Repository } from '../Repository.js';
export declare class MultiImageIndexCollection {
    readonly repository: Repository;
    length: number;
    private indices;
    constructor(repository: Repository);
    add(index: MultiImageIndex): void;
    all(): MultiImageIndex[];
    pullAllImages(docker: Docker): Promise<void>;
}
