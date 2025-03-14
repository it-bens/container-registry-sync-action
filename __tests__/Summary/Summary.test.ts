import { ImageCopyResult } from '../../src/Summary/ImageCopyResult.js'
import { Summary } from '../../src/Summary/Summary.js'

describe('Summary', () => {
  let summary: Summary

  beforeEach(() => {
    summary = new Summary()
  })

  it('should set and get the installed RegCtl version', () => {
    const version = 'v1.0.0'
    summary.setInstalledRegCtlVersion(version)
    expect(summary.getInstalledRegCtlVersion()).toBe(version)
  })

  it('should throw an error if installed RegCtl version is not set', () => {
    expect(() => summary.getInstalledRegCtlVersion()).toThrow(
      'installedRegCtlVersion has not been set'
    )
  })

  it('should add and get image copy results', () => {
    const result: ImageCopyResult = { tag: 'v1.0.0', success: true }
    summary.addImageCopyResult(result)
    expect(summary.getImageCopyResults()).toEqual([result])
  })

  it('should return an empty array if no image copy results are added', () => {
    expect(summary.getImageCopyResults()).toEqual([])
  })
})
