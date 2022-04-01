#!/usr/bin/env node

const plugin = require('@nexssp/plugin')

if (process.env.PATH.includes('\\Scoop\\shims')) {
  console.log('WORKS!')
}

// const _params = require('minimist')(process.argv.slice(2))
const pluginRoot = plugin({
  path: `${__dirname}/..`,
  commandsPath: `lib/cli/commands`,
  benchmark: true,
})
pluginRoot.start({})

const [, , cmd, ...args] = process.argv

pluginRoot.runCommand(cmd, args)
