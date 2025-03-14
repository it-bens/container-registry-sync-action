import { Lifecycle, inject, scoped } from 'tsyringe'
import { ExecInterface } from '../../Utils/GitHubAction/ExecInterface.js'
import { RegCtlVersion } from '../RegCtlVersion.js'
import { RegCtlVersionBuilderInterface } from './RegCtlVersionBuilderInterface.js'

@scoped(Lifecycle.ContainerScoped)
export class RegCtlVersionBuilder implements RegCtlVersionBuilderInterface {
  private readonly lineDelimiter = '\n'
  private readonly expectedLineCount = 8
  private readonly keyStringLength = 12

  constructor(
    @inject('ExecInterface')
    private readonly exec: ExecInterface
  ) {}

  public async buildFromExecOutput(): Promise<RegCtlVersion> {
    const output = await this.exec.getExecOutput('regctl', ['version'])

    const lines: string[] = output.stdout.trim().split(this.lineDelimiter)
    if (lines.length !== this.expectedLineCount) {
      throw new Error(
        `Unexpected number of lines in regctl version output. Expected ${this.expectedLineCount}, got ${lines.length}`
      )
    }

    return {
      vcsTag: this.extractValueFromLine(lines[0]),
      vcsRef: this.extractValueFromLine(lines[1]),
      vcsCommit: this.extractValueFromLine(lines[2]),
      vcsState: this.extractValueFromLine(lines[3]),
      vcsDate: this.extractValueFromLine(lines[4]),
      platform: this.extractValueFromLine(lines[5]),
      goVersion: this.extractValueFromLine(lines[6]),
      goCompiler: this.extractValueFromLine(lines[7])
    }
  }

  private extractValueFromLine(line: string): string {
    const value = line.substring(this.keyStringLength)

    return value.trim()
  }
}
