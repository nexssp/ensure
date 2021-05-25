const os = require('@nexssp/os/legacy')

// first tag means all versions. We specified 1, because it does matter for the first tag
const GentooFirst = os.getTags(os.distros.GENTOO, 1).first()
const Windows = os.getTags(os.distros.WINDOWS, 1).first()
const Windows10 = os.getTags(os.distros.WINDOWS, 10.0).second()
const Windows100 = os.getTags().third()
module.exports = {
  [GentooFirst]: 'dev-vcs/git', // All gentoos will have this other systems has git
  // [Windows100]: (pkg, tags) => {
  //   return 'function works: ' + pkg
  // },
  // [Windows10]: 'git', // Example for string
  // [Windows]: {
  //   install: 'echo different command!',
  // }, // Example for Object
}
