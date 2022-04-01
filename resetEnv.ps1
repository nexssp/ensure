function resetEnv {
    Set-Item `
        -Path (('Env:', $args[0]) -join '') `
        -Value ((
            [System.Environment]::GetEnvironmentVariable($args[0], "Machine"),
            [System.Environment]::GetEnvironmentVariable($args[0], "User")
        ) -match '.' -join ';')
}

resetEnv Path
resetEnv AppPath