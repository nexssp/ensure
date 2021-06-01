const os = require('@nexssp/os/legacy')
const sudo = os.sudo()
// first tag means all versions. We specified 1, because it does matter for the first tag
const GentooFirst = os.getTags(os.distros.GENTOO, 1).first()
const Windows = os.getTags(os.distros.WINDOWS, 1).first()
const Windows10 = os.getTags(os.distros.WINDOWS, 10.0).second()
const Windows100 = os.getTags().third()
module.exports = {
  linux: {
    install: `php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
HASH="$(wget -q -O - https://composer.github.io/installer.sig)"
php -r "if (hash_file('sha384', 'composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
${sudo}php composer-setup.php --install-dir=/usr/local/bin --filename=composer
php -r "unlink('composer-setup.php');"`,
  },
}
