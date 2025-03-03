import { Image as DockerHubImage } from '../../DockerHub/Image.js';
import { Repository } from '../Repository.js';
import { Image } from '../Image.js';
export declare class ImageBuilder {
    buildFromDockerHubImage(image: DockerHubImage, repository: Repository): Image;
}
