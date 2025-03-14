import { It, Mock, Times } from 'moq.ts'
import { CoreInterface } from '../../../src/Utils/GitHubAction/CoreInterface.js'
import { ImageCopyResult } from '../../../src/Summary/ImageCopyResult.js'
import { Printer } from '../../../src/Summary/Service/Printer.js'
import { Summary } from '../../../src/Summary/Summary.js'
import _ from 'lodash'
import { setupMockedCoreInterface } from '../../../__fixtures__/Utils/GitHubAction/setupMockedCoreInterface.js'

describe('Printer', () => {
  let mockedCore: Mock<CoreInterface>
  let printer: Printer
  let summary: Summary

  beforeEach(() => {
    mockedCore = setupMockedCoreInterface()
    printer = new Printer(mockedCore.object())
    summary = new Summary()
  })

  // eslint-disable-next-line jest/expect-expect
  it('should print summary with installed regctl version and image copy results', () => {
    const version = 'v1.0.0'
    summary.setInstalledRegCtlVersion(version)
    const result: ImageCopyResult = { tag: 'v1.0.0', success: true }
    summary.addImageCopyResult(result)

    printer.printSummary(summary)

    mockedCore.verify((core) =>
      core.addRawToSummary(`installed regctl version: ${version}`, true)
    )
    mockedCore.verify((core) => core.addSeparatorToSummary())
    mockedCore.verify((core) =>
      core.addTableToSummary(
        It.Is((value) =>
          _.isEqual(
            [
              [
                { data: 'Tag', header: true },
                { data: 'Result', header: true }
              ],
              [
                { data: 'v1.0.0', header: false },
                { data: '✅', header: false }
              ]
            ],
            value
          )
        )
      )
    )
    mockedCore.verify((core) => core.writeSummary(), Times.Once())
  })

  // eslint-disable-next-line jest/expect-expect
  it('should print summary with no image copy results', () => {
    const version = 'v1.0.0'
    summary.setInstalledRegCtlVersion(version)

    printer.printSummary(summary)

    mockedCore.verify((core) =>
      core.addRawToSummary(`installed regctl version: ${version}`, true)
    )
    mockedCore.verify((core) => core.addSeparatorToSummary(), Times.Never())
    mockedCore.verify(
      (core) => core.addTableToSummary(It.IsAny()),
      Times.Never()
    )
    mockedCore.verify((core) => core.writeSummary(), Times.Once())
  })
})
