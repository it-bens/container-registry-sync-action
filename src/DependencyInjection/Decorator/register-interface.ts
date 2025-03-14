import 'reflect-metadata'
import { Lifecycle, container } from 'tsyringe'
import { constructor } from 'tsyringe/dist/typings/types/index.js'

export function registerInterface<T>(
  interfaceName: string,
  lifecycle?: Lifecycle.ContainerScoped | Lifecycle.ResolutionScoped
): (target: constructor<T>) => void {
  return function (target: constructor<T>) {
    if (lifecycle) {
      container.register(
        interfaceName,
        { useClass: target },
        { lifecycle: lifecycle }
      )

      return
    }

    container.register(interfaceName, { useClass: target })
  }
}
