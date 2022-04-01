const { ensureInstalled } = require('../lib/ensure')

const { which } = require('../lib/ensure')

if (process.platform === 'win32') {
  console.log(which('scoop'))
  console.log(ensureInstalled('scoop', { progress: true }))
}

// Below for debian there will be translator file used as for debian lua5.3 works.
console.log(which('lua'))
console.log(ensureInstalled('lua', { progress: true }))
