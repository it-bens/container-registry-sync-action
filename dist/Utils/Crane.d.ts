export declare class Crane {
    mutate(repository: string, tag: string, annotations: {
        [key: string]: string;
    }, labels: {
        [key: string]: string;
    }): Promise<void>;
}
