import { It, Mock } from 'moq.ts'
import { PrinterInterface } from '../../../src/Summary/Service/PrinterInterface.js'

export function setupMockedPrinterInterface(): Mock<PrinterInterface> {
  const mockedPrinter = new Mock<PrinterInterface>()

  mockedPrinter
    .setup((printer) => printer.printSummary(It.IsAny()))
    .returnsAsync(undefined)

  return mockedPrinter
}
