# Container Registry Sync Action

[![GitHub Super-Linter](https://github.com/it-bens/container-registry-sync-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/it-bens/container-registry-sync-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/it-bens/container-registry-sync-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/it-bens/container-registry-sync-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/it-bens/container-registry-sync-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/it-bens/container-registry-sync-action/actions/workflows/codeql-analysis.yml)

## About

GitHub Action to synchronize docker images between container registries or
inside the same registry. Because some registries enforce increasingly stricter
pull limits a distributed availability of images can reduce problems with limit
hits. The action uses [regclient](https://github.com/regclient/regclient) to
fetch the available tags of a source repository and copies them to a target
repository. A glob-based filter for the tags can be applied. Regclient will skip
any layers that are already present in the target repository.

The action can also be used to copy images within the same registry.

## Usage

### Prerequisites

The action relies on the availability of `regclient` (`regctl` as the CLI
interface) on the runner. It has to be set up before the action is executed. A
registry login might be required as well. It can be done before the action is
executed like below or by the action itself.

```yaml
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      - name: Install regctl
        uses: regclient/actions/regctl-installer@main
```

#### Authentication

The login to the registries can be done in two ways: 1) with docker and 2) with
regclient.

##### Docker login

```yaml
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      # ...
      - name: Login to DockerHub
        uses: regclient/actions/regctl-login@main
        with:
          registry: docker.io
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Login to GHCR
        uses: regclient/actions/regctl-login@main
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

##### regclient login

See [Example](#example)

### Inputs

| name                     | description                                                                                                                 | required | default |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| sourceRepository         | Repository to sync from                                                                                                     | yes      |         |
| loginToSourceRepository  | Whether to log in to the source repository                                                                                  | no       | 'false  |
| sourceRepositoryUsername | Username for the source repository                                                                                          | no       |         |
| sourceRepositoryPassword | Password for the source repository                                                                                          | no       |         |
| targetRepository         | Repository to sync to                                                                                                       | yes      |         |
| loginToTargetRepository  | Whether to log in to the target repository                                                                                  | no       | 'false' |
| targetRepositoryUsername | Username for the target repository                                                                                          | no       |         |
| targetRepositoryPassword | Password for the target repository                                                                                          | no       |         |
| tags                     | Glob pattern to filter which tags to sync (e.g., 'v*' for version tags, '*-stable' for stable tags) based on DockerHub tags | no       | '\*'    |
| regClientConcurrency     | Number of concurrent regclient copy operations                                                                              | no       | 2       |

### Example

```yaml
# copy all tags that start with "6.6." from dockware/dev to ghcr.io/dockware-mirror/dev (between different registries)
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      # ...
      - name: Sync images
        uses: it-bens/container-registry-sync-action@main
        with:
          sourceRepository: 'dockware/dev'
          loginToSourceRepository: 'true'
          sourceRepositoryUsername: ${{ secrets.DOCKERHUB_USERNAME }}
          sourceRepositoryPassword: ${{ secrets.DOCKERHUB_TOKEN }}
          targetRepository: 'ghcr.io/dockware-mirror/dev'
          loginToTargetRepository: 'true'
          targetRepositoryUsername: ${{ github.actor }}
          targetRepositoryPassword: ${{ secrets.GITHUB_TOKEN }}
          tags: '6.6.*'
          regClientConcurrency: 1
```

```yaml
# copy all tags from inside GHCR from dockware/dev to dockware-mirror/dev (within the same registry)
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      # ...
      - name: Sync images
        uses: it-bens/container-registry-sync-action@main
        with:
          sourceRepository: 'ghcr.io/dockware/dev' # no login at the source repository is performed
          targetRepository: 'ghcr.io/dockware-mirror/dev' # login into the target repository is enough
          loginToTargetRepository: 'true'
          targetRepositoryUsername: ${{ github.actor }}
          targetRepositoryPassword: ${{ secrets.GITHUB_TOKEN }}
```

## Contributing

I am really happy that the software developer community loves Open Source, like
I do! ♥

That's why I appreciate every issue that is opened (preferably constructive) and
every pull request that provides other or even better code to this package.

You are all breathtaking!

## Special Thanks

Special thanks goes to the developers of the regclient. The tool is awesome!
This is their site: [regclient.org](https://regclient.org).
