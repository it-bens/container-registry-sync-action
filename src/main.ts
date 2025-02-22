import * as core from '@actions/core'
import { Action } from './Action.js'
import { Crane } from './Utils/Crane.js'
import { Docker } from './Utils/Docker.js'
import { DockerConcurrencyLimiter } from './Utils/DockerConcurrencyLimiter.js'
import { Client as DockerHubClient } from './DockerHub/Service/Client.js'
import { ImageBuilder as DockerHubImageBuilder } from './DockerHub/Service/ImageBuilder.js'
import { IndexBuilder as DockerHubIndexBuilder } from './DockerHub/Service/IndexBuilder.js'
import { TagFilter as DockerHubTagFilter } from './DockerHub/Service/TagFilter.js'
import { Client as GhcrClient } from './Ghcr/Service/Client.js'
import { IndexFilterAgainstGhcrInformation } from './DockerHub/Service/IndexFilterAgainstGhcrInformation.js'
import { Inputs } from './Inputs.js'
import { Logger } from './Utils/Logger.js'

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

  const dockerConcurrencyLimiter = new DockerConcurrencyLimiter(
    dockerConcurrency
  )
  const docker = new Docker(dockerConcurrencyLimiter)
  const crane = new Crane()

  const dockerHubImageBuilder = new DockerHubImageBuilder()
  const dockerHubIndexBuilder = new DockerHubIndexBuilder(dockerHubImageBuilder)
  const dockerHubClient: DockerHubClient = new DockerHubClient(
    dockerHubIndexBuilder
  )
  const dockerHubTagFilter = new DockerHubTagFilter()

  const ghcrClient = new GhcrClient()
  const indexFilterAgainstGhcrInformation =
    new IndexFilterAgainstGhcrInformation(ghcrClient)

  const logger = new Logger()

  const action = new Action(
    inputs,
    dockerHubClient,
    dockerHubTagFilter,
    indexFilterAgainstGhcrInformation,
    docker,
    crane,
    logger
  )

  try {
    await action.run()
  } catch (error: unknown) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
