import 'reflect-metadata'
import * as core from '@actions/core'
import { Action } from './Action.js'
import { Inputs } from './Inputs.js'
import { container } from 'tsyringe'

export async function run() {
  const inputs: Inputs = {
    dockerHubOrganisation: core.getInput('dockerHubOrganisation', {
      required: true
    }),
    dockerHubRepository: core.getInput('dockerHubRepository', {
      required: true
    }),
    ghcrOrganisation: core.getInput('ghcrOrganisation', { required: true }),
    ghcrRepository: core.getInput('ghcrRepository', { required: true }),
    tags: core.getInput('tags', { required: false })
  }

  const dockerConcurrencyInput = core.getInput('dockerConcurrency', {
    required: false
  })
  const dockerConcurrency = parseInt(dockerConcurrencyInput)
  if (isNaN(dockerConcurrency) || dockerConcurrency <= 0) {
    throw new Error(
      'dockerConcurrency must be a positive integer greater than 0'
    )
  }
  container.register('DockerConcurrency', { useValue: dockerConcurrency })

  const action = container.resolve(Action)

  try {
    await action.run(inputs)
  } catch (error: unknown) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
