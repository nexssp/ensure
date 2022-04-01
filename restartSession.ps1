# https://github.com/PowerShell/PowerShell/issues/14536
# users: SeeminglyScience and plastikfan
function restart-session {
    [Alias('ress')]
    param()

    [System.Management.Automation.PathInfo]$pathInfo = Get-Location;
    while ($true) {
        pwsh -WorkingDirectory $($pathInfo.Path)
        if ($LASTEXITCODE) {
            break
        }
    }
}