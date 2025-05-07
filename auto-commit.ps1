while ($true) {
    $status = git status --porcelain | Where-Object { $_ -notmatch '\.env\.local' }

    if ($status) {
        git add . -- ':!.env.local'
        git commit -m "auto update"
        git push
        Write-Host "✅ Push effectué à $(Get-Date -Format 'HH:mm:ss')"
    }

    Start-Sleep -Seconds 10
}

