import { DockerHubApiImage } from '../Remote/DockerHubApiImage.js';
import { Image } from '../Image.js';
import { Repository } from '../Repository.js';
export declare class ImageBuilder {
    buildFromDockerHubApiResponse(apiResponse: DockerHubApiImage, indexName: string, repository: Repository): Image;
}
