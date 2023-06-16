//Validate a string against allowed package.json names
export const validateAppName = (input: string) => {
  const validationRegExp = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  const paths = input.split('/')

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith('@'))

  let appName = paths[paths.length - 1]
  if (paths.findIndex((p) => p.startsWith('@')) !== -1) {
    appName = paths.slice(indexOfDelimiter).join('/')
  }

  if (input === '.' || validationRegExp.test(appName ?? '')) {
    return true
  } else {
    return "App name must consist of only lowercase alphanumeric characters, '-', and '_'"
  }
}

export const validateUmdNamespace = (input: string) => {
  const pascalCaseValidationRegExp = /^[A-Z][a-zA-Z0-9]*$/

  if (input === '') {
    return true
  }

  if (pascalCaseValidationRegExp.test(input)) {
    return true
  } else {
    return "UMD namespace must consist of only lowercase alphanumeric characters, '-', and '_'"
  }
}
