import { Lifecycle, inject, scoped } from 'tsyringe'
import { SummaryTableCell, SummaryTableRow } from '@actions/core/lib/summary.js'
import { CoreInterface } from '../../Utils/GitHubAction/CoreInterface.js'
import { ImageCopyResult } from '../ImageCopyResult.js'
import { PrinterInterface } from './PrinterInterface.js'
import { Summary } from '../Summary.js'

@scoped(Lifecycle.ContainerScoped)
export class Printer implements PrinterInterface {
  constructor(
    @inject('CoreInterface')
    private readonly core: CoreInterface
  ) {}

  public async printSummary(summary: Summary): Promise<void> {
    this.core.addRawToSummary(
      `installed regctl version: ${summary.getInstalledRegCtlVersion()}`,
      true
    )

    if (summary.getImageCopyResults().length > 0) {
      this.core.addSeparatorToSummary()

      const tableHeader: SummaryTableRow = [
        {
          data: 'Tag',
          header: true
        },
        {
          data: 'Result',
          header: true
        }
      ]
      const tableRows = summary
        .getImageCopyResults()
        .map((result: ImageCopyResult): SummaryTableRow => {
          const tagCell: SummaryTableCell = {
            data: result.tag,
            header: false
          }
          const successCell: SummaryTableCell = {
            data: result.success ? '✅' : '❌',
            header: false
          }

          return [tagCell, successCell]
        })

      this.core.addTableToSummary([tableHeader, ...tableRows])
    }

    await this.core.writeSummary()
  }
}
