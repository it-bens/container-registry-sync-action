export declare class Client {
    fetchOriginalDockerHubDigest(repository: string, tag: string): Promise<string | null>;
    private fetchTopLayer;
    private fetchToken;
    private fetchManifest;
}
