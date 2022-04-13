#!/usr/bin/env node

const plugin = require('@nexssp/plugin')

// if (process.platform === 'win32') {
//   if (process.env.Path) {
//     process.env.Path = process.env.Path + ';' + `${require('os').homedir()}\\scoop\\shims\\`
//   } else if (process.env.PATH) {
//     process.env.PATH = process.env.PATH + ';' + `${require('os').homedir()}\\scoop\\shims\\`
//   }
// }

// const _params = require('minimist')(process.argv.slice(2))
const pluginRoot = plugin({
  path: `${__dirname}/..`,
  commandsPath: `lib/cli/commands`,
  benchmark: true,
})
pluginRoot.start({})

const [, , cmd, ...args] = process.argv

pluginRoot.runCommand(cmd, args)
