module.exports = (cmd, args) => {
  const { ensureInstalled } = require('../ensure')
  const { bold, green } = require('@nexssp/ansi')
  const { error } = require('@nexssp/logdebug')
  const cliArgs = require('minimist')(process.argv.slice(2))

  const { progress, verbose, install, wsl } = cliArgs

  if (!progress) {
    console.log(green('To see all installation messages use --progress.'))
  }

  let paramName = cmd

  if (!paramName) {
    error(
      'You need to specify at least one argument - command to ensure is there eg. nexssp-ensure dir'
    )
    process.exit(1)
  }

  if (wsl && !paramName.startsWith('wsl ')) {
    paramName = `wsl ${paramName}`
  }
  const path = ensureInstalled(paramName, install, { progress, verbose })
  console.log(path)
}
