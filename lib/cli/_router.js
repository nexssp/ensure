module.exports = (cmd, args) => {
  const { ensureInstalled } = require('../ensure')
  const { bold, green } = require('@nexssp/ansi')
  const { error } = require('@nexssp/logdebug')
  const cliArgs = require('minimist')(process.argv.slice(2))

  const { progress, verbose, install, wsl } = cliArgs

  if (!progress) {
    console.log(green('To see all installation messages use --progress.'))
  }

  if (!cliArgs._[0]) {
    error(
      'You need to specify at least one argument - command to ensure is there eg. nexssp-ensure dir'
    )
    process.exit(1)
  }

  if (wsl && !cliArgs._[0].startsWith('wsl ')) {
    cliArgs._[0] = `wsl ${cliArgs._[0]}`
  }
  const path = ensureInstalled(cliArgs._[0], install, { progress, verbose })
  console.log(path)
}
