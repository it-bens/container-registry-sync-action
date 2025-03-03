import 'reflect-metadata'
import * as core from '@actions/core'
import { Action } from './Action.js'
import { Core } from './Utils/GitHubAction/Core.js'
import { Inputs } from './Inputs.js'
import { container } from 'tsyringe'

export async function run() {
  const inputs: Inputs = {
    sourceRepository: core.getInput('sourceRepository', {
      required: true
    }),
    targetRepository: core.getInput('targetRepository', {
      required: true
    }),
    tags: core.getInput('tags', { required: false })
  }

  const regClientConcurrencyInput = core.getInput('regClientConcurrency', {
    required: false
  })
  const regClientConcurrency = parseInt(regClientConcurrencyInput)
  if (isNaN(regClientConcurrency) || regClientConcurrency <= 0) {
    throw new Error(
      'regClientConcurrency must be a positive integer greater than 0'
    )
  }
  container.register('RegClientConcurrency', { useValue: regClientConcurrency })

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
