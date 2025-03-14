import 'reflect-metadata'
import { Action } from './Action.js'
import { Container } from './DependencyInjection/Container.js'
import { CoreInterface } from './Utils/GitHubAction/CoreInterface.js'
import { Inputs } from './Inputs.js'

export async function run() {
  const container = await buildContainer()
  const core: CoreInterface = container.resolve(
    'CoreInterface'
  ) as CoreInterface

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
  const container = await buildContainer()
  const core: CoreInterface = container.resolve(
    'CoreInterface'
  ) as CoreInterface

  const inputs = buildInputs(core)
  const action = container.resolve(Action)

  try {
    await action.post(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const core = container.resolve('CoreInterface') as CoreInterface
      core.setFailed(error.message)
    }
  }
}

async function buildContainer(): Promise<Container> {
  const container: Container = new Container()
  await container.registerInterfaces()

  const core = container.resolve('CoreInterface') as CoreInterface
  container.registerValue(
    'RegClientConcurrency',
    parseRegClientConcurrency(core)
  )
  container.registerValue('ENV_HOME', parseEnvHome(core))

  return container
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

function parseRegClientConcurrency(core: CoreInterface): number {
  const regClientConcurrencyInput = core.getInput('regClientConcurrency', {
    required: false
  })
  const regClientConcurrency = parseInt(regClientConcurrencyInput)
  if (isNaN(regClientConcurrency) || regClientConcurrency <= 0) {
    core.setFailed(
      'regClientConcurrency must be a positive integer greater than 0'
    )
  }

  return regClientConcurrency
}

function parseEnvHome(core: CoreInterface): string {
  const envHome = process.env.HOME
  if (!envHome) {
    core.setFailed('HOME environment variable is not set')
  }

  return envHome as string
}

function parseLoginToInput(input: string): boolean {
  return input === 'true' || input === '1'
}
