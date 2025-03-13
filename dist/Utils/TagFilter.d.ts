import { TagFilterInterface } from './TagFilterInterface.js';
export declare class TagFilter implements TagFilterInterface {
    filter(tags: string[], tagPattern: string): string[];
}
