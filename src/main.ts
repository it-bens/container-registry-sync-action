import 'reflect-metadata'
import * as core from '@actions/core'
import { Action } from './Action.js'
import { Core } from './Utils/GitHubAction/Core.js'
import { Inputs } from './Inputs.js'
import { container } from 'tsyringe'

export async function run() {
  const inputs = buildInputs()
  prepareContainer()
  const action = container.resolve(Action)

  try {
    await action.run(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const core = container.resolve(Core)
      core.setFailed(error.message)
    }
  }
}

export async function post() {
  const inputs = buildInputs()
  prepareContainer()
  const action = container.resolve(Action)

  try {
    await action.post(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) {
      const core = container.resolve(Core)
      core.setFailed(error.message)
    }
  }
}

function buildInputs(): Inputs {
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

function prepareContainer() {
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
}

function parseLoginToInput(input: string): boolean {
  return input === 'true' || input === '1'
}
