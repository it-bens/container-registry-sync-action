import { DownloaderInterface } from './DownloaderInterface.js';
export declare class Downloader implements DownloaderInterface {
    downloadFile(fileUrl: string, destination: string): Promise<void>;
}
