const { ensureInstalled } = require('../lib/ensure')

const { which } = require('../lib/ensure')

if (process.platform === 'win32') {
  console.log(which('scoop'))
  console.log(ensureInstalled('scoop', { progress: true }))
}

console.log(which('lua'))
console.log(ensureInstalled('lua', { progress: true }))
