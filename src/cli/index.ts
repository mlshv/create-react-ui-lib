import chalk from 'chalk'
import { Command } from 'commander'
import inquirer from 'inquirer'
import { getVersion, validateAppName, getUserPkgManager, logger, validateUmdNamespace } from '~/utils'
import { DEFAULT_LIBRARY_NAME, DEFAULT_UMD_NAMESPACE, DEFAULT_DOCS_ENGINE } from './constants'

type CliFlags = {
  noGit: boolean
  noInstall: boolean
  default: boolean
}

type CliResults = {
  appName: string
  umdNamespace: string
  flags: CliFlags
  docsEngine: 'storybook' | 'ladle'
  eslint: boolean
}

const defaultOptions: CliResults = {
  appName: DEFAULT_LIBRARY_NAME,
  umdNamespace: DEFAULT_UMD_NAMESPACE,
  docsEngine: DEFAULT_DOCS_ENGINE,
  eslint: true,
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
  },
}

export const runCli = async () => {
  const cliResults = defaultOptions

  const program = new Command().name('create-react-ui-lib')

  program
    .description('A CLI tool to spin up React.js UI library development')
    .argument('[dir]', 'The name of the library, as well as the name of the directory to create')
    .option('-y, --default', 'Bypass the CLI and use all default options to bootstrap a new React UI library', false)

    .version(getVersion(), '-v, --version', 'Display the version number')
    .addHelpText('afterAll', `\n The CLI was inspired by ${chalk.hex('#E8DCFF').bold('create-t3-app')} CLI \n`)
    .parse(process.argv)

  // Needs to be separated outside the if statement to correctly infer the type as string | undefined
  const cliProvidedName = program.args[0]

  if (!cliResults.flags.default) {
    if (cliProvidedName) {
      cliResults.appName = cliProvidedName
    }

    if (!cliProvidedName) {
      cliResults.appName = await promptAppName()
    }

    cliResults.umdNamespace = await promptUmdNamespace()
    cliResults.docsEngine = await promptDocsEngine()
    cliResults.eslint = await promptEslint()

    if (!cliResults.flags.noGit) {
      cliResults.flags.noGit = !(await promptGit())
    }

    if (!cliResults.flags.noInstall) {
      cliResults.flags.noInstall = !(await promptInstall())
    }
  }

  return cliResults
}

const promptAppName = async (): Promise<string> => {
  const { appName } = await inquirer.prompt<Pick<CliResults, 'appName'>>({
    name: 'appName',
    type: 'input',
    message: 'Input package name for npm (use kebab-case):',
    default: defaultOptions.appName,
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim()
    },
  })

  return appName
}

const promptUmdNamespace = async (): Promise<string> => {
  const { umdNamespace } = await inquirer.prompt<Pick<CliResults, 'umdNamespace'>>({
    name: 'umdNamespace',
    type: 'input',
    message: 'Input namespace for UMD build (use PascalCase):',
    default: defaultOptions.umdNamespace,
    validate: validateUmdNamespace,
    transformer: (input: string) => {
      return input.trim()
    },
  })

  return umdNamespace
}

const promptDocsEngine = async (): Promise<'storybook' | 'ladle'> => {
  const { docsEngine } = await inquirer.prompt<Pick<CliResults, 'docsEngine'>>({
    name: 'docsEngine',
    type: 'list',
    message: 'Choose a documentation engine:',
    choices: [
      {
        name: 'Storybook (https://storybook.js.org/)',
        value: 'storybook',
      },
      {
        name: 'Ladle (https://ladle.dev/)',
        value: 'ladle',
      },
    ],
    default: DEFAULT_DOCS_ENGINE,
  })

  return docsEngine
}

const promptEslint = async (): Promise<boolean> => {
  const { eslint } = await inquirer.prompt<{ eslint: boolean }>({
    name: 'eslint',
    type: 'confirm',
    message: 'Would you like to use ESLint?',
    default: true,
  })

  return eslint
}

const promptInstall = async (): Promise<boolean> => {
  const pkgManager = getUserPkgManager()

  const { install } = await inquirer.prompt<{ install: boolean }>({
    name: 'install',
    type: 'confirm',
    message: `Would you like us to run '${pkgManager}` + (pkgManager === 'yarn' ? `'?` : ` install'?`),
    default: true,
  })

  if (install) {
    logger.success("Alright. We'll install the dependencies for you!")
  } else {
    if (pkgManager === 'yarn') {
      logger.info(`No worries. You can run '${pkgManager}' later to install the dependencies.`)
    } else {
      logger.info(`No worries. You can run '${pkgManager} install' later to install the dependencies.`)
    }
  }

  return install
}

const promptGit = async (): Promise<boolean> => {
  const { git } = await inquirer.prompt<{ git: boolean }>({
    name: 'git',
    type: 'confirm',
    message: 'Initialize a new git repository?',
    default: true,
  })

  if (git) {
    logger.success('Nice one! Initializing repository!')
  } else {
    logger.info('Sounds good! You can come back and run git init later.')
  }

  return git
}
