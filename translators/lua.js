const os = require('@nexssp/os/legacy')

// first tag means all versions. We specified 1, because it does matter for the first tag
const DEBIAN = os.getTags(os.distros.DEBIAN, 1).first()
const UBUNTU = os.getTags(os.distros.UBUNTU, 1).first()

module.exports = {
  [DEBIAN]: 'lua5.3',
  [UBUNTU]: 'lua5.3',
}
