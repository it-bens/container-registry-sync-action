import * as io from '@actions/io'

export class Io {
  public async mkdirP(path: string) {
    await io.mkdirP(path)
  }
}
