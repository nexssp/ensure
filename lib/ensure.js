const { execSync } = require('child_process')
const _log = require('@nexssp/logdebug')
const ansi = require('@nexssp/ansi')
const { nexssOS1 } = require('./config/os-config')

function isFunction(f) {
  return f && {}.toString.call(f) === '[object Function]'
}

function isObject(a) {
  return !!a && a.constructor === Object
}

const EOL = '\n'

// Trying to find translator for this package.
// eg. git for gentoo is dev-vcs/git
const getTranslator = (pkg) => {
  const d = (...args) => _log.d('@ensure @getTranslator:', ...args)
  let translators

  try {
    translators = require(`../translators/${pkg}`)
  } catch (error) {
    d(`translator for ${pkg} does not exist.`)
    return false
  }

  const currentOsTags = nexssOS1.getTags()
  const currentOsTag1 = currentOsTags.first()
  const currentOsTag2 = currentOsTags.second()
  const currentOsTag3 = currentOsTags.third()

  d('currentOsTags 3,2,1: ', currentOsTag3, currentOsTag2, currentOsTag1)
  const currentTranslator =
    translators[currentOsTag3] || translators[currentOsTag2] || translators[currentOsTag1]

  return currentTranslator
}

// 3 tags (look at .tags() function)

const getInstallCommand = (pkg, distro, version) => {
  if (distro && !version) {
    _log.error(
      'You must specify distro and version. Specify 1 if you want to use only distro name.'
    )
    process.exit(1)
  }
  if (distro) {
    tags = nexssOS1.tags(distro, version)
  } else {
    tags = nexssOS1.tags()
  }
  const d = (...args) => _log.d('@ensure @getInstallCommand:', ...args)

  const currentTranslator = getTranslator(pkg, tags)

  if (currentTranslator) {
    d('translator exists.')
    // Translator for this command exists
    // We check if it has string which is just
    // standard replacement or object or function
    if (isFunction(currentTranslator)) {
      d('translator is a function')
      return currentTranslator(pkg, tags)
    } else if (isObject(currentTranslator)) {
      d('is object', currentTranslator)
      // for now only install command
      return currentTranslator.install
    } else {
      d('translator does not exist: ', currentTranslator)
    }
  }
  d('is string', currentTranslator)
  return `${nexssOS1.getPM('install')} ${pkg}`
}

const ensureInstalled = (pkg, installCommand, options = { progress: false, verbose: true }) => {
  // Below is for the nexss programmer only but not affects others.
  if ((pkg && pkg.indexOf('installed') === 0) || !pkg) return

  if (require('path').isAbsolute(pkg) && require('fs').existsSync(pkg)) {
    return pkg
  }

  let path = nexssOS1.checkPath(pkg)

  let defaultOptions = { stdio: 'inherit' }
  if (process.platform === 'win32') {
    defaultOptions.shell = true
  } else {
    defaultOptions.shell = process.shell
  }

  defaultOptions.maxBuffer = 10485760 // 10 * 1024 * 1024;
  if (Object.keys(options).length > 0) {
    Object.assign(defaultOptions, options)
  }

  // For Python we have some error display from Microsoft which we need to check if this is python
  if (!path || (path.split && ~path.split('\n')[0].indexOf('WindowsApps\\python'))) {
    // For other then Powershell we use && for next line commands
    let shellCommandSeparator = '&&'

    if (
      options &&
      options.shell &&
      options.shell.toLowerCase() === 'powershell' // For Poweshell 5.1 is ; needed pwsh 6 is working with &&
    ) {
      shellCommandSeparator = ';'
    }

    if (!installCommand) {
      installCommand = getInstallCommand(pkg)

      log.error(`${pkg} seems to not exist and Install command has not been specified for: ${pkg}`)
      process.exit(1)
    }

    log.info(`installing ${ansi.yellow(ansi.bold(pkg))}, please wait..`)

    // It will not display progress..
    if (!options.progress) {
      defaultOptions.stdio = ['ignore', 'pipe', 'pipe']
    }

    log.info(`running command: ${ansi.bold(installCommand)}`)

    delete defaultOptions.verbose
    delete defaultOptions.progress

    try {
      execSync(
        installCommand
          .replace('<package>', pkg)
          .replace('<module>', pkg)
          .split(/\r?\n/) // Added multiline commands
          .join(` ${shellCommandSeparator} `),
        defaultOptions
      )

      path = module.exports.checkPath(pkg)
      if (path) {
        log.success(`${pkg} has been installed by: ${installCommand}`)
      } else {
        log.error(`${pkg} has NOT been installed by: ${installCommand}.`)
        process.exitCode = 1
        return
      }
    } catch (er) {
      log.info(er.stdout ? er.stdout.toString() : '')
      log.info(er.stderr ? er.stderr.toString() : '')
      // Scoop or Powershell Issues Needs to be fixed.
      log.error(`There was an issue with the command:\n${ansi.bold(installCommand)}`)
      if (pkg === 'scoop') {
        log.error(
          `This is not happening often on modern systems however there was a problem with ${ansi.bold(
            'SCOOP'
          )} command and it's installation OR Powershell.`
        )
        log.error('Please run commands Scoop or Powershell.exe. Both should display something.')
        log.error('you need to make sure Powershell and Scoop is working properly.')
        log.error(
          'If you are on Windows 7 or 8.1 Please go to: https://github.com/nexssp/cli/wiki/Windows-7-or-8'
        )
        log.error(
          "Please check if your antivirus didn't move Powershell to the Chest: https://support.avast.com/en-us/article/Use-Antivirus-Virus-Chest"
        )
      }
      process.exit()
      // throw Error(er);
    }
  } else {
    // multiple can be used:
    if (options.verbose && !pkg.startsWith('wsl')) {
      const exploded = path.split(EOL)
      if (exploded.length > 1) {
        log.dbg(
          `${ansi.bold(pkg)} has been found at multiple location(s) ${EOL}${ansi.bold(
            path
          )}${EOL}and this one is used: ${ansi.bold(exploded[0])}`
        )
      } else {
        log.dbg(`${ansi.bold(pkg)} has been found at the location ${ansi.bold(exploded[0])}`)
      }
    }
    return path
  }
}

module.exports = { ensureInstalled }