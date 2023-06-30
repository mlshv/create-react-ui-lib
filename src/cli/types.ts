import type { PackageManager } from '../utils'

export type DocsEngine = 'storybook' | 'ladle'

export type InstallerOptions = {
  projectDir: string
  umdNamespace: string
  pkgManager: PackageManager
  noInstall: boolean
  docsEngine: DocsEngine
  projectName?: string
}
