import { fileURLToPath } from 'url'
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const generateClassMap = () => {
  const files = glob.sync(path.resolve(projectRoot, 'src/**/*.ts'))
  const classMap: Record<string, string> = {}

  files.forEach((file) => {
    const fileName = path.basename(file, '.ts')
    if (/^[A-Z].*/.test(fileName)) {
      const relativePath = path.relative(projectRoot, file)
      classMap[fileName] = `./${relativePath.replace(/\\/g, '/')}`
    }
  })

  fs.writeFileSync(
    path.resolve(projectRoot, 'src/DependencyInjection/class-map.json'),
    JSON.stringify(classMap, null, 2)
  )
}

generateClassMap()
