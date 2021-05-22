# @nexssp/ensure

- Make sure it is installed (Linux, WSL, Windows) and macOS soon..

- This package is used in many packages. For example in the @nexssp/languages where you can install over 50 programming languages. Try `npx @nexssp/languages r install` or `npx @nexssp/languages php install`.

## API

### Functions

- `ensureInstalled(command/package, installCommand, options)`
- `cmd(command)` - return function which can execute commands starts from 'command' - examples soon.
- `which(command)` - returns path of the command, false if not exists.

### Examples

```js
const { ensureInstalled } = require("@nexssp/ensure");

const path = ensureInstalled("jq", "apt install jq", {
  progress: cliArgs.progress,
});

// Windows Subsystem for Linux
const path = ensureInstalled("wsl jq", "wsl -u root apt install jq");
```

## CLI tool

```sh
nexssp-ensure jq --install="apt install jq"

# Windows Subsystem for Linux
nexssp-ensure "wsl jq" --install="wsl -u root apt install jq"
```
