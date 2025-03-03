import { Repository } from './Repository.js';
import { Image } from './Image.js';
import { Docker } from '../Utils/Docker.js';
import { Crane } from '../Utils/Crane.js';
export declare class ImageCollection {
    readonly repository: Repository;
    private readonly images;
    constructor(repository: Repository);
    add(image: Image): void;
    push(docker: Docker, crane: Crane): Promise<void>;
}
