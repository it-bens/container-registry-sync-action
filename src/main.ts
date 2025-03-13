import 'reflect-metadata'
import { Action } from './Action.js'
import { Core } from './Utils/GitHubAction/Core.js'
import { CoreInterface } from './Utils/GitHubAction/CoreInterface.js'
import { Downloader } from './Utils/Downloader.js'
import { Exec } from './Utils/GitHubAction/Exec.js'
import { Inputs } from './Inputs.js'
import { Io } from './Utils/GitHubAction/Io.js'
import { Logger } from './Utils/Logger.js'
import { RegClient } from './Utils/RegClient.js'
import { RegClientConcurrencyLimiter } from './Utils/RegClient/RegClientConcurrencyLimiter.js'
import { RegClientCredentialsBuilder } from './Login/Service/RegClientCredentialsBuilder.js'
import { RegCtlBinaryBuilder } from './Install/Service/RegCtlBinaryBuilder.js'
import { TagFilter } from './Utils/TagFilter.js'
import { TagSorter } from './Utils/TagSorter.js'
import { container } from 'tsyringe'

export async function run() {
  const core = container.resolve(Core) as CoreInterface
  prepareContainer(core)
  const inputs = buildInputs(core)

  const action = container.resolve(Action)

  try {
    await action.run(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const core = container.resolve('CoreInterface') as CoreInterface
      core.setFailed(error.message)
    }
  }
}

export async function post() {
  const core = container.resolve(Core) as CoreInterface
  prepareContainer(core)
  const inputs = buildInputs(core)

  const action = container.resolve(Action)

  try {
    await action.post(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const core = container.resolve(Core) as CoreInterface
      core.setFailed(error.message)
    }
  }
}

function buildInputs(core: CoreInterface): Inputs {
  return {
    sourceRepository: core.getInput('sourceRepository', {
      required: true
    }),
    loginToSourceRepository: parseLoginToInput(
      core.getInput('loginToSourceRepository', { required: false })
    ),
    sourceRepositoryUsername: core.getInput('sourceRepositoryUsername', {
      required: false
    }),
    sourceRepositoryPassword: core.getInput('sourceRepositoryPassword', {
      required: false
    }),
    targetRepository: core.getInput('targetRepository', {
      required: true
    }),
    loginToTargetRepository: parseLoginToInput(
      core.getInput('loginToTargetRepository', { required: false })
    ),
    targetRepositoryUsername: core.getInput('targetRepositoryUsername', {
      required: false
    }),
    targetRepositoryPassword: core.getInput('targetRepositoryPassword', {
      required: false
    }),
    tags: core.getInput('tags', { required: false })
  }
}

function prepareContainer(core: CoreInterface) {
  const regClientConcurrencyInput = core.getInput('regClientConcurrency', {
    required: false
  })
  const regClientConcurrency = parseInt(regClientConcurrencyInput)
  if (isNaN(regClientConcurrency) || regClientConcurrency <= 0) {
    core.setFailed(
      'regClientConcurrency must be a positive integer greater than 0'
    )
  }
  container.register('RegClientConcurrency', { useValue: regClientConcurrency })

  const envHome = process.env.HOME
  if (!envHome) {
    core.setFailed('HOME environment variable is not set')
  }
  container.register('ENV_HOME', { useValue: envHome })

  container.register('CoreInterface', { useClass: Core })
  container.register('DownloaderInterface', { useClass: Downloader })
  container.register('ExecInterface', { useClass: Exec })
  container.register('IoInterface', { useClass: Io })
  container.register('LoggerInterface', { useClass: Logger })
  container.register('RegClientInterface', { useClass: RegClient })
  container.register('RegClientConcurrencyLimiterInterface', {
    useClass: RegClientConcurrencyLimiter
  })
  container.register('RegCtlBinaryBuilderInterface', {
    useClass: RegCtlBinaryBuilder
  })
  container.register('RegClientCredentialsBuilderInterface', {
    useClass: RegClientCredentialsBuilder
  })
  container.register('TagFilterInterface', { useClass: TagFilter })
  container.register('TagSorterInterface', { useClass: TagSorter })
}

function parseLoginToInput(input: string): boolean {
  return input === 'true' || input === '1'
}
