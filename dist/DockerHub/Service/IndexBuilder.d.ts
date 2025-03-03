import { DockerHubApiIndex } from '../Remote/DockerHubApiIndex.js';
import { ImageBuilder } from './ImageBuilder.js';
import { MultiImageIndex } from '../Index/MultiImageIndex.js';
import { Repository } from '../Repository.js';
import { SingleImageIndex } from '../Index/SingleImageIndex.js';
export declare class IndexBuilder {
    private readonly imageBuilder;
    constructor(imageBuilder: ImageBuilder);
    buildMultiImageIndexFromDockerHubApiResponse(apiResponse: DockerHubApiIndex, repository: Repository): MultiImageIndex;
    buildSingleImageIndexFromDockerHubApiResponse(apiResponse: DockerHubApiIndex, repository: Repository): SingleImageIndex;
}
