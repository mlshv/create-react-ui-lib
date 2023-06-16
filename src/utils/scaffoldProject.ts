import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import ora from 'ora'
import path from 'path'

import { type InstallerOptions } from '~/cli/types'
import { logger } from '~/utils'
import { CLI_ROOT, DEFAULT_UMD_NAMESPACE } from '~/cli/constants'

export const scaffoldProject = async ({
  projectName,
  umdNamespace,
  projectDir,
  pkgManager,
  noInstall,
}: InstallerOptions) => {
  const srcDir = path.join(CLI_ROOT, '..', 'template')

  if (!noInstall) {
    logger.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`)
  } else {
    logger.info('')
  }

  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start()

  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      if (projectName !== '.') spinner.info(`${chalk.cyan.bold(projectName)} exists but is empty, continuing...\n`)
    } else {
      spinner.stopAndPersist()
      const { overwriteDir } = await inquirer.prompt<{
        overwriteDir: 'abort' | 'clear' | 'overwrite'
      }>({
        name: 'overwriteDir',
        type: 'list',
        message: `${chalk.redBright.bold('Warning:')} ${chalk.cyan.bold(
          projectName,
        )} already exists and isn't empty. How would you like to proceed?`,
        choices: [
          {
            name: 'Abort installation (recommended)',
            value: 'abort',
            short: 'Abort',
          },
          {
            name: 'Clear the directory and continue installation',
            value: 'clear',
            short: 'Clear',
          },
          {
            name: 'Continue installation and overwrite conflicting files',
            value: 'overwrite',
            short: 'Overwrite',
          },
        ],
        default: 'abort',
      })
      if (overwriteDir === 'abort') {
        spinner.fail('Aborting installation...')
        process.exit(1)
      }

      const overwriteAction = overwriteDir === 'clear' ? 'clear the directory' : 'overwrite conflicting files'

      const { confirmOverwriteDir } = await inquirer.prompt<{
        confirmOverwriteDir: boolean
      }>({
        name: 'confirmOverwriteDir',
        type: 'confirm',
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      })

      if (!confirmOverwriteDir) {
        spinner.fail('Aborting installation...')
        process.exit(1)
      }

      if (overwriteDir === 'clear') {
        spinner.info(`Emptying ${chalk.cyan.bold(projectName)} and creating t3 app..\n`)
        fs.emptyDirSync(projectDir)
      }
    }
  }

  spinner.start()

  fs.copySync(srcDir, projectDir)

  renameDotfiles(projectDir)
  replaceUmdNamespace(projectDir, umdNamespace)

  const scaffoldedName = projectName === '.' ? 'App' : chalk.cyan.bold(projectName)

  spinner.succeed(`${scaffoldedName} ${chalk.green('scaffolded successfully!')}\n`)
}

const renameDotfiles = (projectDir: string) => {
  ;['_gitignore', '_prettierrc'].forEach((file) => {
    fs.renameSync(path.join(projectDir, file), path.join(projectDir, `.${file.slice(1)}`))
  })
}

const replaceUmdNamespace = (projectDir: string, umdNamespace: string) => {
  const viteConfigPath = path.join(projectDir, 'vite.config.ts')
  const data = fs.readFileSync(viteConfigPath, 'utf-8')
  const result = data.replace(DEFAULT_UMD_NAMESPACE, umdNamespace)

  fs.writeFileSync(viteConfigPath, result, 'utf8')
}
