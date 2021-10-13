const { ensureInstalled } = require('../lib/ensure')

const { which } = require('../lib/ensure')

console.log(which('lua'))
console.log(ensureInstalled('lua', { progress: true }))
