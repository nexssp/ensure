#!/usr/bin/env node
const { ensureInstalled } = require("../");
const { bold, green } = require("@nexssp/ansi");
const { error } = require("@nexssp/logdebug");

(async () => {
  const cliArgs = require("minimist")(process.argv.slice(2));

  if (cliArgs._[0] === "help") {
    const pkg = require("../package.json");

    console.log(`   ${bold(pkg.name)}@${pkg.version}`);
    console.log(`nexssp-ensure installed ls --install=''`);
    process.exit(0);
  }
  console.time(bold("@nexssp/ensure"));

  const { progress, verbose, install, wsl } = cliArgs;
  if (!progress) {
    console.log(green("To see all installation messages use --progress."));
  }

  if (!cliArgs._[0]) {
    error(
      "You need to specify at least one argument - command to ensure is there eg. nexssp-ensure dir"
    );
    process.exit(1);
  }

  if (wsl && !cliArgs._[0].startsWith("wsl ")) {
    cliArgs._[0] = `wsl ${cliArgs._[0]}`;
  }

  const path = ensureInstalled(cliArgs._[0], install, { progress, verbose });

  console.log(`Found at: ${bold(path)}`);
  console.timeEnd(bold("@nexssp/ensure"));
})();
