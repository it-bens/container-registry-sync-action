import { Summary } from '../Summary.js'

export interface PrinterInterface {
  printSummary(summary: Summary): Promise<void>
}
