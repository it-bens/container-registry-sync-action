import * as exec from '@actions/exec'
import { DockerConcurrencyLimiter } from './DockerConcurrencyLimiter.js'
import { ImageInformation } from '../Docker/ImageInformation.js'

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

  public async inspectImage(
    repository: string,
    tag: string
  ): Promise<ImageInformation[] | null> {
    let output = ''
    let error = ''
    const options = {
      // The image inspect command returns a non-zero exit code if the image does not exist,
      // so it must not fail if an error is written to stderr.
      failOnStdErr: false,
      ignoreReturnCode: true,
      listeners: {
        stdout: (data: Buffer) => {
          output += data.toString()
        },
        stderr: (data: Buffer) => {
          error += data.toString()
        }
      }
    }

    await exec.exec(
      'docker',
      ['image', 'inspect', `${repository}:${tag}`],
      options
    )

    if (error.length > 0) {
      return null
    }
    if (output.length === 0) {
      return null
    }

    return JSON.parse(output)
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
