export declare class RegCtlBinary {
    readonly installationDirectory: string;
    readonly version: string;
    readonly platform: string;
    readonly arch: string;
    private readonly repositoryBaseUrl;
    constructor(installationDirectory: string, version: string, platform: string, arch: string);
    buildDownloadUrl(): string;
    getBinaryName(): string;
    getInstallationPath(): string;
    private getBinaryExtension;
}
