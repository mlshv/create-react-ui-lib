import fs from 'fs-extra'
import path from 'path'
import { type PackageJson } from 'type-fest'

import { CLI_ROOT } from '~/cli/constants'

export const getVersion = () => {
  const packageJsonPath = path.join(CLI_ROOT, '..', 'package.json')

  const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson

  return packageJsonContent.version ?? '1.0.0'
}
