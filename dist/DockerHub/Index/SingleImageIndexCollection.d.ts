import { Docker } from '../../Utils/Docker.js';
import { Image } from '../Image.js';
import { Repository } from '../Repository.js';
import { SingleImageIndex } from './SingleImageIndex.js';
export declare class SingleImageIndexCollection {
    readonly repository: Repository;
    length: number;
    private indices;
    constructor(repository: Repository);
    add(index: SingleImageIndex): void;
    all(): SingleImageIndex[];
    allImages(): Image[];
    pullAllImages(docker: Docker): Promise<void>;
}
