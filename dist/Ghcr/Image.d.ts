import { Crane } from '../Utils/Crane.js';
import { Docker } from '../Utils/Docker.js';
import { Image as DockerHubImage } from '../DockerHub/Image.js';
import { Repository } from './Repository.js';
export declare class Image {
    readonly repository: Repository;
    readonly dockerHubImage: DockerHubImage;
    private readonly originalDigestAnnotation;
    constructor(repository: Repository, dockerHubImage: DockerHubImage);
    static fromDockerHubImage(repository: Repository, dockerHubImage: DockerHubImage): Image;
    name(): string;
    push(docker: Docker, crane: Crane): Promise<void>;
}
