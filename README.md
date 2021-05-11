# @nexssp/ensure

- Make sure it is installed (Linux, WSL, Windows)

## API

### Functions

- `ensureInstalled(command/package, installCommand, options)`

### Examples

```js
const { ensureInstalled } = require("@nexssp/ensure");

const path = ensureInstalled("jq", "apt install jq");

// Windows Subsystem for Linux
const path = ensureInstalled("wsl jq", "wsl -u root apt install jq");
```

## CLI tool

```sh
nexssp-ensure jq --install="apt install jq"

# Windows Subsystem for Linux
nexssp-ensure "wsl jq" --install="wsl -u root apt install jq"
```
