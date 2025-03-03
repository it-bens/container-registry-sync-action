import { DockerHubApiImage } from './DockerHubApiImage.js';
export interface DockerHubApiIndex {
    name: string;
    images: DockerHubApiImage[];
    digest: string;
}
