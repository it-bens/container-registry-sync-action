import * as core from '@actions/core';
import { SummaryTableRow, SummaryWriteOptions } from '@actions/core/lib/summary.js';
export interface CoreInterface {
    addPath(inputPath: string): void;
    addRawToSummary(text: string, addEol: boolean): void;
    addSeparatorToSummary(): void;
    addTableToSummary(rows: SummaryTableRow[]): void;
    error(message: string): void;
    getInput(name: string, options?: core.InputOptions): string;
    info(message: string): void;
    platform(): string;
    platformArch(): string;
    setFailed(message: string): void;
    writeSummary(options?: SummaryWriteOptions): Promise<void>;
}
