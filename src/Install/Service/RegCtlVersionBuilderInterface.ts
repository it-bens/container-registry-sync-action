import { RegCtlVersion } from '../RegCtlVersion.js'

export interface RegCtlVersionBuilderInterface {
  buildFromExecOutput(): Promise<RegCtlVersion>
}
