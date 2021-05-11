const { execSync } = require("child_process");
const log = require("@nexssp/logdebug");
const ansi = require("@nexssp/ansi");

const EOL = "\n";
const platform = process.platform;
const which = platform === "win32" ? "cmd /c where" : "command -v";

const cmd = (command) => {
  const shell = require("@nexssp/os").getShell();
  return (what) => {
    try {
      return execSync(`${command} ${what}`, {
        shell, //remember to take shell from @nexssp/os
      })
        .toString()
        .trim();
    } catch (error) {
      return false;
    }
  };
};

const ensureInstalled = (
  pkg,
  installCommand,
  options = { progress: false, verbose: true }
) => {
  if ((pkg && pkg.indexOf("installed") === 0) || !pkg) return;

  if (require("path").isAbsolute(pkg) && require("fs").existsSync(pkg)) {
    return pkg;
  }

  let path = module.exports.checkPath(pkg);

  let defaultOptions = { stdio: "inherit" };
  if (process.platform === "win32") {
    defaultOptions.shell = true;
  } else {
    defaultOptions.shell = process.shell;
  }

  defaultOptions.maxBuffer = 10485760; // 10 * 1024 * 1024;
  if (Object.keys(options).length > 0) {
    Object.assign(defaultOptions, options);
  }

  // For Python we have some error display from Microsoft which we need to check if this is python
  if (
    !path ||
    (path.split && ~path.split("\n")[0].indexOf("WindowsApps\\python"))
  ) {
    // For other then Powershell we use && for next line commands
    let shellCommandSeparator = "&&";

    if (
      options &&
      options.shell &&
      options.shell.toLowerCase() === "powershell" // For Poweshell 5.1 is ; needed pwsh 6 is working with &&
    ) {
      shellCommandSeparator = ";";
    }

    if (!installCommand) {
      log.error(
        `${pkg} seems to not exist and Install command has not been specified for: ${pkg}`
      );
      process.exit(1);
    }

    log.info(`installing ${ansi.yellow(ansi.bold(pkg))}, please wait..`);

    // It will not display progress..
    if (!options.progress) {
      defaultOptions.stdio = ["ignore", "pipe", "pipe"];
    }

    log.info(`running command: ${ansi.bold(installCommand)}`);

    delete defaultOptions.verbose;
    delete defaultOptions.progress;

    try {
      execSync(
        installCommand
          .replace("<package>", pkg)
          .replace("<module>", pkg)
          .split(/\r?\n/) // Added multiline commands
          .join(` ${shellCommandSeparator} `),
        defaultOptions
      );

      path = module.exports.checkPath(pkg);
      if (path) {
        log.success(`${pkg} has been installed by: ${installCommand}`);
      } else {
        log.error(`${pkg} has NOT been installed by: ${installCommand}.`);
        process.exitCode = 1;
        return;
      }
    } catch (er) {
      log.info(er.stdout ? er.stdout.toString() : "");
      log.info(er.stderr ? er.stderr.toString() : "");
      // Scoop or Powershell Issues Needs to be fixed.
      log.error(
        `There was an issue with the command:\n${ansi.bold(installCommand)}`
      );
      if (pkg === "scoop") {
        log.error(
          `This is not happening often on modern systems however there was a problem with ${ansi.bold(
            "SCOOP"
          )} command and it's installation OR Powershell.`
        );
        log.error(
          "Please run commands Scoop or Powershell.exe. Both should display something."
        );
        log.error(
          "you need to make sure Powershell and Scoop is working properly."
        );
        log.error(
          "If you are on Windows 7 or 8.1 Please go to: https://github.com/nexssp/cli/wiki/Windows-7-or-8"
        );
        log.error(
          "Please check if your antivirus didn't move Powershell to the Chest: https://support.avast.com/en-us/article/Use-Antivirus-Virus-Chest"
        );
      }
      process.exit();
      // throw Error(er);
    }
  } else {
    // multiple can be used:
    if (options.verbose && !pkg.startsWith("wsl")) {
      const exploded = path.split(EOL);
      if (exploded.length > 1) {
        log.dbg(
          `${ansi.bold(
            pkg
          )} has been found at multiple location(s) ${EOL}${ansi.bold(
            path
          )}${EOL}and this one is used: ${ansi.bold(exploded[0])}`
        );
      } else {
        log.dbg(
          `${ansi.bold(pkg)} has been found at the location ${ansi.bold(
            exploded[0]
          )}`
        );
      }
    }
    return path;
  }
};

module.exports.checkPath = (pkg) => {
  if (pkg.startsWith("wsl")) {
    const wsl = module.exports.which("wsl");
    if (!wsl) {
      const wslInfo = require("../config/wslInstallInfo");
      wslInfo();
      process.exit(1);
    }

    return module.exports.checkWSLCommand(pkg.substring(4));
  } else {
    return module.exports.which(pkg);
  }
};

module.exports.checkWSLCommand = (command) => {
  try {
    const r = execSync(`wsl ${command}`, {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch (error) {
    // console.log("command not found", error);
  }
};

module.exports.cmd = cmd;
module.exports.which = cmd(which);
module.exports.ensureInstalled = ensureInstalled;
