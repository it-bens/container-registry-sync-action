import * as core from '@actions/core'
import { Lifecycle, scoped } from 'tsyringe'
import {
  SummaryTableRow,
  SummaryWriteOptions
} from '@actions/core/lib/summary.js'
import { CoreInterface } from './CoreInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class Core implements CoreInterface {
  public addPath(inputPath: string): void {
    core.addPath(inputPath)
  }

  public addRawToSummary(text: string, addEol: boolean): void {
    core.summary.addRaw(text, addEol)
  }

  public addSeparatorToSummary(): void {
    core.summary.addSeparator()
  }

  public addTableToSummary(rows: SummaryTableRow[]): void {
    core.summary.addTable(rows)
  }

  public error(message: string): void {
    core.error(message)
  }

  public getInput(name: string, options?: core.InputOptions): string {
    return core.getInput(name, options)
  }

  public info(message: string): void {
    core.info(message)
  }

  public platform(): string {
    return core.platform.platform
  }

  public platformArch(): string {
    return core.platform.arch
  }

  public setFailed(message: string): void {
    core.setFailed(message)
  }

  public async writeSummary(options?: SummaryWriteOptions): Promise<void> {
    await core.summary.write(options)
  }
}
