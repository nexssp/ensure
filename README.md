# @nexssp/ensure

```sh
# or on js ensureInstalled('git')
nexssp-ensure git # will install git on any os you are.
```

IT's more then **@nexssp/os** function as it has `translator`. What it means? that for example on Gentoo to install git you need to put `emerge dev-vcs/git` (not git). We cover that in the **@nexssp/extend**. We will be building the database of what and which distro what kind of changes has. For example:

## Translator file example

### Git

Below is just: All Gentoos use 'dev-vcs/git'.

```js
const os = require('@nexssp/os/legacy')
// first tag means all versions. We specified 1, because it does matter for the first tag
const GentooFirst = os.getTags(os.distros.GENTOO, 1).first()
module.exports = {
  [GentooFirst]: 'dev-vcs/git', // All gentoos will have this other systems has git
}
```

```js
const result = ensureInstalled("git") => it will automatically install git on your machine
```

- Function just make sure your program is installed (Linux, WSL, Windows) and macOS soon..

- This package is used in many packages. For example in the @nexssp/languages where you can install over 50 programming languages. Try `npx @nexssp/languages r install` or `npx @nexssp/languages php install`.

## API

### Functions

- `ensureInstalled(command/package, installCommand, options)`
- `cmd(command)` - return function which can execute commands starts from 'command' - examples soon.
- `which(command)` - returns path of the command, false if not exists.

### Examples

```js
const { ensureInstalled } = require('@nexssp/ensure')

const path = ensureInstalled('jq', 'apt install jq', {
  progress: cliArgs.progress,
})

// Windows Subsystem for Linux
const path = ensureInstalled('wsl jq', 'wsl -u root apt install jq')
```

## CLI tool

```sh
nexssp-ensure jq --install="apt install jq"

# Windows Subsystem for Linux
nexssp-ensure "wsl jq" --install="wsl -u root apt install jq"
```
