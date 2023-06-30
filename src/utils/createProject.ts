import path from 'path'

import { DocsEngine } from '~/cli/types'
import { scaffoldProject } from '~/utils'
import { getUserPkgManager } from '~/utils'

type CreateProjectOptions = {
  projectName: string
  umdNamespace: string
  noInstall: boolean
  docsEngine: DocsEngine
}

export const createProject = async ({ projectName, umdNamespace, docsEngine, noInstall }: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  await scaffoldProject({
    projectName,
    umdNamespace,
    projectDir,
    docsEngine,
    pkgManager,
    noInstall,
  })

  return projectDir
}
