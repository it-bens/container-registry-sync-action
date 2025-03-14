import { InjectionToken, container } from 'tsyringe'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { registerInterface } from './Decorator/register-interface.js'

export class Container {
  public registerValue(key: string, value: unknown): void {
    container.register(key, { useValue: value })
  }

  public resolve<T>(token: InjectionToken<T>): T {
    return container.resolve(token)
  }

  public async registerInterfaces(): Promise<void> {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const srcDir = path.resolve(__dirname, '../../')

    const classMap = await import('./class-map.json', {
      assert: { type: 'json' }
    })

    for (const [className, relativePath] of Object.entries(classMap.default)) {
      const filePath = path.join(srcDir, relativePath)
      const module = await import(filePath)
      const target = module[className]
      if (typeof target === 'function' && target.prototype) {
        const interfaceName = Reflect.getMetadata('design:interface', target)
        const lifecycle = Reflect.getMetadata('design:lifecycle', target)
        if (interfaceName) {
          registerInterface(interfaceName, lifecycle)(target)
        }
      }
    }
  }
}
