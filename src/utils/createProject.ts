import path from 'path'
import { scaffoldProject } from '~/utils'
import { getUserPkgManager } from '~/utils'

interface CreateProjectOptions {
  projectName: string
  umdNamespace: string
  noInstall: boolean
}

export const createProject = async ({ projectName, umdNamespace, noInstall }: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager()
  const projectDir = path.resolve(process.cwd(), projectName)

  await scaffoldProject({
    projectName,
    umdNamespace,
    projectDir,
    pkgManager,
    noInstall,
  })

  return projectDir
}
