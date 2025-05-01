while ($true) {
    $status = git status --porcelain
    if ($status) {
        git add .
        git commit -m "auto update"
        git push
    }
    Start-Sleep -Seconds 10
}
