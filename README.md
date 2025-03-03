# Container Registry Sync Action

[![GitHub Super-Linter](https://github.com/it-bens/container-registry-sync-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/it-bens/container-registry-sync-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/it-bens/container-registry-sync-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/it-bens/container-registry-sync-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/it-bens/container-registry-sync-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/it-bens/container-registry-sync-action/actions/workflows/codeql-analysis.yml)

## About

GitHub Action to synchronize docker images between container registries. Because
some registries enforce increasingly stricter pull limits a distributed
availability of images can reduce problems with limit hits. The action uses
[regclient](https://github.com/regclient/regclient) to fetch the available tags
of a source repository and copies them to a target repository. A glob-based
filter for the tags can be applied. Regclient will skip any layers that are
already present in the target repository.

## Usage

### Prerequisites

The action relies on the availability of `regclient` (`regctl` as the CLI
interface) on the runner. It has to be set up before the action is executed. A
registry login might be required as well. RegClient provides actions to install
it and to login it into a registry.

```yaml
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      - name: Install regctl
        uses: regclient/actions/regctl-installer@main

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

The login to DockerHub is optional but recommended to prevent the mentioned pull
rate limiting issues. On the other hand, the login to the GitHub Container
Registry is mandatory to push the images.

### Inputs

| name                 | description                                                                                                                 | required | default |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| sourceRepository     | Repository to sync from                                                                                                     | yes      |         |
| targetRepository     | Repository to sync to                                                                                                       | yes      |         |
| tags                 | Glob pattern to filter which tags to sync (e.g., 'v*' for version tags, '*-stable' for stable tags) based on DockerHub tags | no       | '\*'    |
| regClientConcurrency | Number of concurrent regclient copy operations                                                                              | no       | 2       |

### Example

```yaml
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
          targetRepository: 'ghcr.io/dockware-mirror/dev'
          tags: '6.6.*'
          regClientConcurrency: 1
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
