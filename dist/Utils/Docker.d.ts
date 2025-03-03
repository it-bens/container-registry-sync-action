import { DockerConcurrencyLimiter } from './DockerConcurrencyLimiter.js';
import { ImageInformation } from '../Docker/ImageInformation.js';
export declare class Docker {
    private readonly concurrencyLimiter;
    constructor(concurrencyLimiter: DockerConcurrencyLimiter);
    createManifest(repository: string, tag: string, images: {
        repository: string;
        digest: string;
    }[]): Promise<void>;
    deleteManifest(repository: string, tag: string, failOnError?: boolean): Promise<void>;
    inspectImage(repository: string, tag: string): Promise<ImageInformation[] | null>;
    pull(repository: string, tag: string, architecture: string, failOnError?: boolean): Promise<void>;
    push(repository: string, tag: string, architecture?: string): Promise<void>;
    pushManifest(repository: string, tag: string): Promise<void>;
    tag(sourceRepository: string, sourceTag: string, targetRepository: string, targetTag: string): Promise<void>;
}
