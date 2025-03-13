import { DownloaderInterface } from './DownloaderInterface.js';
import { LoggerInterface } from './LoggerInterface.js';
export declare class Downloader implements DownloaderInterface {
    private readonly logger;
    constructor(logger: LoggerInterface);
    downloadFile(fileUrl: string, destination: string): Promise<void>;
}
