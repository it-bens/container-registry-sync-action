# DockerHub to GHCR Sync Action

[![GitHub Super-Linter](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/it-bens/sync-images-from-dockerhub-to-ghcr-action/actions/workflows/codeql-analysis.yml)

## About

GitHub Action to synchronize docker images from DockerHub to the GitHub
Container Registry. Not all docker images are available at DockerHub and the
GHCR. Because DockerHub enforces increasingly stricter pull limits a distributed
availability of images can reduce problems with limit hits. The action is
capable of handling docker indices with one or multiple images. Is also contains
logic to prevent unnecessary pulls and pushes. Multi images indices like
multi-arch images will always reference images in the GHCR.

## Usage

### Prerequisites

The action relies on the availability `docker` and `crane` on the runner. They
have to be set up before the action is executed.

The following steps are recommended:

1. Set up Docker with `docker/setup-docker-action`
2. Install and setup Go with `actions/setup-go`
3. Install `crane` with `imjasonh/setup-crane`
4. Login to DockerHub with `docker/login-action` (optional)
5. Login to the GitHub Container Registry with `docker/login-action`

```yaml
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      - name: Set up Docker
        uses: docker/setup-docker-action@370a7dad4b8ce8dbf00f9363e1652e5074dd6abe # v4.1.0

      - name: Install and setup Go
        uses: actions/setup-go@f111f3307d8850f501ac008e886eec1fd1932a34 # v5.3.0
        with:
          go-version: 1.24

      - name: Install crane
        uses: imjasonh/setup-crane@31b88efe9de28ae0ffa220711af4b60be9435f6e # v0.4

      - name: Login to DockerHub
        uses: docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567 # v3.3.0
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Login to GitHub Container Registry
        uses: docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567 # v3.3.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

The login to DockerHub is optional but recommended to prevent the mentioned pull
rate limiting issues. On the other hand, the login to the GitHub Container
Registry is mandatory to push the images.

### Inputs

| name                  | description                                                                                                                 | required | default |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| dockerHubOrganisation | DockerHub organisation to sync from                                                                                         | yes      |         |
| dockerHubRepository   | DockerHub repository to sync from                                                                                           | yes      |         |
| ghcrOrganisation      | GHCR organisation to sync to                                                                                                | yes      |         |
| ghcrRepository        | GHCR repository to sync to                                                                                                  | yes      |         |
| tags                  | Glob pattern to filter which tags to sync (e.g., 'v*' for version tags, '*-stable' for stable tags) based on DockerHub tags | no       | "\*"    |
| dockerConcurrency     | Number of concurrent Docker pull and push operations                                                                        | no       | 2       |

### Example

```yaml
jobs:
  sync-images:
    name: Sync images from DockerHub to GHCR
    runs-on: ubuntu-24.04
    steps:
      # ...
      - name: Sync images
        uses: it-bens/sync-images-from-dockerhub-to-ghcr-action@0.1.0
        with:
          dockerHubOrganisation: 'dockware'
          dockerHubRepository: 'dev'
          ghcrOrganisation: 'dockware-mirror'
          ghcrRepository: 'dev'
          tags: '6.6.*'
          dockerConcurrency: 1
```

## Image Skipping

Docker push and pull operations can be very expensive as the images can be GBs
in size. The action will add a "com.dockerhub.original-digest" label to every
image that has been successfully pushed to the GHCR. This tag contains the
digest of the image on DockerHub and is used in an early phase of the action to
skip images that have already been pushed and are up-to-date.

## Contributing

I am really happy that the software developer community loves Open Source, like
I do! ♥

That's why I appreciate every issue that is opened (preferably constructive) and
every pull request that provides other or even better code to this package.

You are all breathtaking!
