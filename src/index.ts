#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'

import { runCli } from './cli'
import { logger, parseNameAndPath, installDependencies, initializeGit, logNextSteps, createProject } from './utils'

const main = async () => {
  const {
    appName,
    umdNamespace,
    flags: { noGit, noInstall },
  } = await runCli()

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName)

  const projectDir = await createProject({
    projectName: appDir,
    umdNamespace,
    noInstall,
  })

  const pkgJson = fs.readJSONSync(path.join(projectDir, 'package.json'))
  pkgJson.name = scopedAppName
  fs.writeJSONSync(path.join(projectDir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  if (!noInstall) {
    await installDependencies({ projectDir })
  }

  if (!noGit) {
    await initializeGit(projectDir)
  }

  logNextSteps({ projectName: appDir, noInstall })

  process.exit(0)
}

main().catch((err) => {
  logger.error('Aborting installation...')
  if (err instanceof Error) {
    logger.error(err)
  } else {
    logger.error('An unknown error has occurred. Please open an issue on GitHub with the below:')
    console.log(err)
  }
  process.exit(1)
})
