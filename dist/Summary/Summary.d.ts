import { ImageCopyResult } from './ImageCopyResult.js';
export declare class Summary {
    private installedRegCtlVersion;
    private imageCopyResults;
    setInstalledRegCtlVersion(version: string): void;
    addImageCopyResult(result: ImageCopyResult): void;
    getInstalledRegCtlVersion(): string;
    getImageCopyResults(): ImageCopyResult[];
}
