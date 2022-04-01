const { execSync } = require('child_process')
const _log = require('@nexssp/logdebug')
const ansi = require('@nexssp/ansi')
const { nexssOS1 } = require('./config/os-config')
const { is } = require('@nexssp/data')

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

  d('currentOsTags 3,2,1,platform: ', currentOsTag3, currentOsTag2, currentOsTag1)
  const currentTranslator =
    translators[currentOsTag3] ||
    translators[currentOsTag2] ||
    translators[currentOsTag1] ||
    translators[process.platform]

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
    if (is('function', currentTranslator)) {
      d('translator is a function')
      return currentTranslator(pkg, tags)
    } else if (is('object', currentTranslator)) {
      d('is object', currentTranslator)
      // for now only install command
      return currentTranslator.install
    } else {
      d('translator does not exist: ', currentTranslator)
      return `${nexssOS1.getPM('install')} ${currentTranslator}`
    }
  }
  d('is string', currentTranslator)
  return `${nexssOS1.getPM('install')} ${pkg}`
}

const ensureInstalled = (pkg, installCommand, options = { progress: false, verbose: true }) => {
  if (is('object', installCommand)) {
    options = installCommand
    installCommand = null
  }

  // Below is for the nexss programmer only but not affects others.
  if ((pkg && pkg.indexOf('installed') === 0) || !pkg) return

  if (require('path').isAbsolute(pkg) && require('fs').existsSync(pkg)) {
    return pkg
  }

  if (process.platform === 'win32') {
    console.log('Checking SCOOP...')
    // scoop needs to special treatment
    const homeDir = require('os').homedir()
    const scoopDir = `${homeDir}\\scoop\\shims`
    console.log('HOME DIR IS: ', homeDir)
    console.log('SCOOP DIR IS: ', scoopDir)

    if (require('fs').existsSync(scoopDir)) {
      console.log('SCOOP DIR EXISTS')
    }
  }

  let path = nexssOS1.checkPath(pkg)

  let defaultOptions = { stdio: 'inherit' }
  if (process.platform === 'win32') {
    defaultOptions.shell = true
  } else {
    defaultOptions.shell = nexssOS1.getShell()
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
      if (!installCommand) {
        _log.error(
          `${pkg} seems to not exist and Install command has not been specified for: ${pkg}`
        )
        process.exit(1)
      }
    }

    // It will not display progress..
    if (!options.progress) {
      defaultOptions.stdio = ['ignore', 'pipe', 'pipe']
    }

    _log.info(`running command: ${ansi.bold(installCommand)}`)

    delete defaultOptions.verbose
    delete defaultOptions.progress

    let shellPath
    if (process.platform === 'win32') {
      shellPath = nexssOS1.checkPath('pwsh')
      if (shellPath) _log.info(`ShellPath: ${shellPath}`)
      if (!shellPath) {
        shellPath = nexssOS1.checkPath('powershell')
        if (shellPath) _log.info(`ShellPath: ${shellPath}`)
      }
    }

    _log.info(`installing ${ansi.yellow(ansi.bold(pkg))}, please wait..`)

    const result = execSync(
      installCommand
        .replace('<package>', pkg)
        .replace('<module>', pkg)
        .split(/\r?\n/) // Added multiline commands
        .join(` ${shellCommandSeparator} `),
      defaultOptions
    )

    if (pkg === 'scoop') {
      const homeDir = require('os').homedir()
      const scoopDir = `${homeDir}\\scoop\\shims\\scoop`
      console.log('RESULT!!! SCOOP: ', result, 'scoopdir', scoopDir)

      if (require('fs').existsSync(scoopDir)) {
        console.log('SCOOP EXISTS!!!', scoopDir)
        return scoopDir
      }
    } else {
      // Checking after installation
      return nexssOS1.checkPath(pkg)
    }

    try {
      const result = execSync(
        installCommand
          .replace('<package>', pkg)
          .replace('<module>', pkg)
          .split(/\r?\n/) // Added multiline commands
          .join(` ${shellCommandSeparator} `),
        defaultOptions
      )

      if (pkg === 'scoop') {
        const scoopDir = `${homeDir}\\scoop\\shims\\scoop`
        console.log('RESULT!!! SCOOP: ', result, 'scoopdir', scoopDir)

        if (require('fs').existsSync(scoopDir)) {
          console.log('SCOOP EXISTS!!!', scoopDir)
          path = scoopDir
        }
      } else {
        // Checking after installation
        path = nexssOS1.checkPath(pkg)
      }

      if (path) {
        _log.success(`${pkg} has been installed by: ${installCommand}`)
        return path
      } else {
        if (result) console.log(result.toString())
        _log.error(`${pkg} has NOT been installed by: ${installCommand}.`)
        _log.error(bold(`Maybe you need to restart your terminal and try again.`))
        process.exitCode = 1
        return
      }
    } catch (er) {
      const erStdout = er.stdout ? er.stdout.toString() : ''
      if (erStdout) _log.info(erStdout)
      const erStderr = er.stderr ? er.stderr.toString() : ''
      if (erStderr) _log.info(erStderr)
      // Scoop or Powershell Issues Needs to be fixed.
      _log.error(`There was an issue with the command:\n${ansi.bold(installCommand)}`)
      if (pkg === 'scoop' || pkg === 'scoop2') {
        _log.error(
          `This is not happening often on modern systems however there was a problem with ${ansi.bold(
            'SCOOP'
          )} command and it's installation OR Powershell.`
        )
        _log.error('Please run commands Scoop or Powershell.exe. Both should display something.')
        _log.error('you need to make sure Powershell and Scoop is working properly.')
        _log.error(
          'If you are on Windows 7 or 8.1 Please go to: https://github.com/nexssp/cli/wiki/Windows-7-or-8'
        )
        _log.error(
          "Please check if your antivirus didn't move Powershell to the Chest: https://support.avast.com/en-us/article/Use-Antivirus-Virus-Chest"
        )
        _log.success(
          `To install scoop manually please run in your powershell:
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iex (new-object net.webclient).downloadstring('https://get.scoop.sh')`
        )
      }
      process.exit(1)
      // throw Error(er);
    }
  } else {
    // multiple can be used:
    if (options.verbose && !pkg.startsWith('wsl')) {
      const exploded = path.split(EOL)
      if (exploded.length > 1) {
        _log.dbg(
          `${ansi.bold(pkg)} has been found at multiple location(s) ${EOL}${ansi.bold(
            path
          )}${EOL}and this one is used: ${ansi.bold(exploded[0])}`
        )
      } else {
        _log.dbg(`${ansi.bold(pkg)} has been found at the location ${ansi.bold(exploded[0])}`)
      }
    }
    return path
  }
}

module.exports = { ensureInstalled, which: nexssOS1.checkPath, getTranslator }
