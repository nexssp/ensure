const os = require('@nexssp/os/legacy')

// first tag means all versions. We specified 1, because it does matter for the first tag
const GentooFirst = os.getTags(os.distros.GENTOO, 1).first()
const Windows = os.getTags(os.distros.WINDOWS, 1).first()
const Windows10 = os.getTags(os.distros.WINDOWS, 10.0).second()
const Windows100 = os.getTags().third()
module.exports = {
  [Windows]: {
    install: `powershell -command "Set-ExecutionPolicy RemoteSigned -scope CurrentUser" && powershell -command "iex (new-object net.webclient).downloadstring('https://get.scoop.sh')" && echo Please restart your terminal window.`,
  },
  linux: {
    install: `echo "Scoop is a package manager which works only for windows platforms."`,
  },
}
