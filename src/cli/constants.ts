import path from 'path'
import { fileURLToPath } from 'url'

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url)
const srcCliPath = path.dirname(__filename)
export const CLI_ROOT = path.join(srcCliPath)

export const DEFAULT_LIBRARY_NAME = 'react-ui-library-template'
export const DEFAULT_UMD_NAMESPACE = 'ViteReactLibraryTemplate'
export const DEFAULT_DOCS_ENGINE = 'storybook'
