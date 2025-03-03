import { Docker } from '../../Utils/Docker.js';
import { Image } from '../Image.js';
import { Repository } from '../Repository.js';
export declare class SingleImageIndex {
    readonly repository: Repository;
    readonly name: string;
    readonly digest: string;
    readonly image: Image;
    constructor(repository: Repository, name: string, digest: string, image: Image);
    pullImage(docker: Docker): Promise<void>;
}
