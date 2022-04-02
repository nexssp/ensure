# @nexssp/ensure

NEW: **02.04.2022** Added workflows + support for MacOS.

```sh
# or on js ensureInstalled('git')
nexssp-ensure git # will install git on any os you are. If it is installed it will return the path.
```

It's more then **@nexssp/os** function as it has `translator`. What it means? that for example on Gentoo to install git you need to put `emerge dev-vcs/git` (not git). We cover that in the **@nexssp/extend**. We will be building the database of what and which distro what kind of changes has. For example:

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
- `which(command)` - returns path of the command/program, false if does not exist.

### Examples

```js
const { ensureInstalled } = require('@nexssp/ensure')

const path = ensureInstalled('jq', 'apt install jq', {
  progress: cliArgs.progress,
})

// You can also pass 2 parameters and install command will be generated based on @nexssp/os and translators.
const path2 = ensureInstalled('lua', {
  progress: cliArgs.progress,
})

// Windows Subsystem for Linux
const path3 = ensureInstalled('wsl jq', 'wsl -u root apt install jq')
```

## CLI tool

```sh
nexssp-ensure jq --install="apt install jq"

# Windows Subsystem for Linux
nexssp-ensure "wsl jq" --install="wsl -u root apt install jq"
```

## Development

### Translator files

#### Example 1

When ensure installing the packages it is looking at the translator files. Here are the examples:

```js
const os = require('@nexssp/os/legacy')

// first tag means all versions. We specified 1, because it does matter for the first tag which is Windows
const Windows = os.getTags(os.distros.WINDOWS, 1).first() // first is always Windows. You could use also "win32", "linux", "darwin" .. all from https://nodejs.org/api/process.html#process_process_platform, but also distros based on @nexssp/os tags

module.exports = {
  [Windows]: {
    install: `powershell -command "Set-ExecutionPolicy RemoteSigned -scope CurrentUser" ; powershell -command "iex (new-object net.webclient).downloadstring('https://get.scoop.sh')"`,
  },
}
```

### Example 2

```js
const os = require('@nexssp/os/legacy')

const GentooFirst = os.getTags(os.distros.GENTOO, 1).first()

module.exports = {
  [GentooFirst]: 'dev-vcs/git', // All gentoos will have this other systems has git, other systems will have standard.
}
```
