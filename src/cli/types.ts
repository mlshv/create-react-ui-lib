import type { PackageManager } from '../utils'

export type InstallerOptions = {
  projectDir: string
  umdNamespace: string
  pkgManager: PackageManager
  noInstall: boolean
  projectName?: string
}
