import * as exec from '@actions/exec'
import { DockerConcurrencyLimiter } from './DockerConcurrencyLimiter.js'

export class Docker {
  constructor(private readonly concurrencyLimiter: DockerConcurrencyLimiter) {}

  public async createManifest(
    repository: string,
    tag: string,
    images: { repository: string; digest: string }[]
  ): Promise<void> {
    const imageRefs = images.map(
      (image) => `${image.repository}@${image.digest}`
    )
    await exec.exec('docker', [
      'manifest',
      'create',
      `${repository}:${tag}`,
      ...imageRefs
    ])
  }

  public async deleteManifest(
    repository: string,
    tag: string,
    failOnError: boolean = true
  ): Promise<void> {
    const options = {
      failOnStdErr: failOnError,
      ignoreReturnCode: !failOnError
    }

    await exec.exec(
      'docker',
      ['manifest', 'rm', `${repository}:${tag}`],
      options
    )
  }

  public async pull(
    repository: string,
    tag: string,
    architecture: string,
    failOnError: boolean = true
  ): Promise<void> {
    const options = {
      failOnStdErr: failOnError,
      ignoreReturnCode: !failOnError
    }

    await this.concurrencyLimiter.execute(() =>
      exec.exec(
        'docker',
        ['pull', `${repository}:${tag}`, '--platform', architecture],
        options
      )
    )
  }

  public async push(
    repository: string,
    tag: string,
    architecture?: string
  ): Promise<void> {
    await this.concurrencyLimiter.execute(async () => {
      if (architecture) {
        await exec.exec('docker', [
          'push',
          `${repository}:${tag}`,
          '--platform',
          architecture
        ])
        return
      }

      await exec.exec('docker', ['push', `${repository}:${tag}`])
    })
  }

  public async pushManifest(repository: string, tag: string): Promise<void> {
    await exec.exec('docker', ['manifest', 'push', `${repository}:${tag}`])
  }

  public async tag(
    sourceRepository: string,
    sourceTag: string,
    targetRepository: string,
    targetTag: string
  ): Promise<void> {
    await exec.exec('docker', [
      'tag',
      `${sourceRepository}:${sourceTag}`,
      `${targetRepository}:${targetTag}`
    ])
  }
}
