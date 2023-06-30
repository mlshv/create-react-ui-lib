import chalk from 'chalk'
import deepmerge from 'deepmerge'
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
  docsEngine,
  eslint,
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
        spinner.info(`Emptying ${chalk.cyan.bold(projectName)} and creating the library project...\n`)
        fs.emptyDirSync(projectDir)
      }
    }
  }

  spinner.start()

  fs.copySync(srcDir, projectDir)

  fs.renameSync(path.join(projectDir, '_gitignore'), path.join(projectDir, '.gitignore'))
  replaceUmdNamespace(projectDir, umdNamespace)

  handleFileContentVariations(projectDir, { docsEngine, eslint: eslint ? 'yes' : 'no' })

  const scaffoldedName = projectName === '.' ? 'App' : chalk.cyan.bold(projectName)

  spinner.succeed(`${scaffoldedName} ${chalk.green('scaffolded successfully!')}\n`)
}

const replaceUmdNamespace = (projectDir: string, umdNamespace: string) => {
  const viteConfigPath = path.join(projectDir, 'vite.config.ts')
  const data = fs.readFileSync(viteConfigPath, 'utf-8')
  const result = data.replace(DEFAULT_UMD_NAMESPACE, umdNamespace)

  fs.writeFileSync(viteConfigPath, result, 'utf8')
}

const processDirectory = (dirPath: string, variations: Record<string, string>) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  entries.forEach((entry) => {
    if (!entry.isDirectory()) {
      return
    }

    const fullPath = path.join(dirPath, entry.name)

    if (entry.name.startsWith('_')) {
      const subFolders = fs.readdirSync(fullPath, { withFileTypes: true })

      subFolders.forEach((subFolder) => {
        const variationFileBase = variations[subFolder.name]

        if (!variationFileBase || !subFolder.isDirectory()) return

        const variationFolderPath = path.join(fullPath, subFolder.name)
        const variationFiles = fs.readdirSync(variationFolderPath)

        const fileName = variationFiles.find((fileName) => fileName.startsWith(variationFileBase))

        if (!fileName) return

        const variationFilePath = path.join(variationFolderPath, fileName)
        const newFilePath = path.join(dirPath, entry.name.replace('_', ''))

        const isDirectory = fs.lstatSync(variationFilePath).isDirectory()

        if (isDirectory) {
          fs.copySync(variationFilePath, newFilePath)
        } else if (path.extname(fileName) === '.json' && fs.existsSync(newFilePath)) {
          const existingContent = fs.readFileSync(newFilePath, 'utf-8')
          const variationContent = fs.readFileSync(variationFilePath, 'utf-8')
          const mergedContent = JSON.stringify(
            deepmerge(JSON.parse(existingContent), JSON.parse(variationContent)),
            null,
            2,
          )
          fs.writeFileSync(newFilePath, mergedContent)
        } else {
          const variationContent = fs.readFileSync(variationFilePath)
          fs.writeFileSync(newFilePath, variationContent)
        }
      })

      fs.rmdirSync(fullPath, { recursive: true })
    } else {
      processDirectory(fullPath, variations) // recursive call
    }
  })
}

const handleFileContentVariations = (projectDir: string, variations: Record<string, string>) => {
  processDirectory(projectDir, variations)
}
