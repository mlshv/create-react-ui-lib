import path from 'path'

import { DocsEngine } from '~/cli/types'
import { scaffoldProject } from '~/utils'
import { getUserPkgManager } from '~/utils'

type CreateProjectOptions = {
  projectName: string
  umdNamespace: string
  eslint: boolean
  noInstall: boolean
  docsEngine: DocsEngine
}

export const createProject = async ({
  projectName,
  umdNamespace,
  docsEngine,
  eslint,
  noInstall,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  await scaffoldProject({
    projectName,
    umdNamespace,
    projectDir,
    docsEngine,
    eslint,
    pkgManager,
    noInstall,
  })

  return projectDir
}
