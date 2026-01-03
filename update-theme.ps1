# PowerShell script to update all TSX files with theme-aware classes - REFINED VERSION

$pagesPath = "d:\e-waste\e-waste\pages"
$componentsPath = "d:\e-waste\e-waste\components"

# Patterns to KEEP (don't replace these)
$keepPatterns = @(
    'text-\[#10b981\]',    # Primary green color
    'text-\[#34D399\]',    # Primary green variant  
    'text-\[#f59e0b\]',    # Orange/amber color
    'text-red-',           # Error colors
    'text-green-',         # Success colors
    'text-blue-',          # Info colors
    'bg-\[#10b981\]',      # Primary green backgrounds
    'bg-\[#34D399\]',      # Primary green variant
    'bg-\[#f59e0b\]',      # Orange backgrounds
    'bg-red-',             # Error backgrounds
    'bg-green-',           # Success backgrounds
    'bg-blue-',            # Info backgrounds
    'hover:theme-text',    # Already converted
    'hover:text-red',      # Error hover states
    'theme-text-heading',  # Already converted
    'theme-text-primary',  # Already converted
    'theme-text-secondary', # Already converted
    'theme-bg-primary',    # Already converted
    'theme-bg-secondary',  # Already converted
    'theme-bg-card',       # Already converted
    'theme-border',        # Already converted
    'theme-hover'          # Already converted
)

function Update-ThemeInFile {
    param (
        [string]$filePath
    )
    
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    $updated = $false
    
    # Only replace in className attributes or class assignments
    # Replace dark backgrounds
    if ($content -match 'bg-\[#0B1116\]' -and $content -notmatch 'theme-bg') {
        $content = $content -replace '(\s)bg-\[#0B1116\]', '$1theme-bg-primary'
        $updated = $true
    }
    if ($content -match 'bg-\[#0B1120\]' -and $content -notmatch 'theme-bg') {
        $content = $content -replace '(\s)bg-\[#0B1120\]', '$1theme-bg-primary'
        $updated = $true
    }
    if ($content -match 'bg-\[#151F26\]' -and $content -notmatch 'theme-bg') {
        $content = $content -replace '(\s)bg-\[#151F26\]', '$1theme-bg-secondary'
        $updated = $true
    }
    
    # Replace borders (but preserve specific border colors)
    if ($content -match 'border-white/5(?!\w)' -and $content -notmatch 'theme-border') {
        $content = $content -replace '(\s)border-white/5(?!\w)', '$1theme-border'
        $updated = $true
    }
    if ($content -match 'border-white/10(?!\w)' -and $content -notmatch 'theme-border') {
        $content = $content -replace '(\s)border-white/10(?!\w)', '$1theme-border'
        $updated = $true
    }
    
    # Replace hover backgrounds
    if ($content -match 'hover:bg-white/5(?!\w)' -and $content -notmatch 'theme-hover') {
        $content = $content -replace 'hover:bg-white/5(?!\w)', 'theme-hover'
        $updated = $true
    }
    if ($content -match 'hover:bg-white/10(?!\w)' -and $content -notmatch 'theme-hover') {
        $content = $content -replace 'hover:bg-white/10(?!\w)', 'theme-hover'
        $updated = $true
    }
    
    if ($updated -and ($content -ne $originalContent)) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "Updated: $($filePath | Split-Path -Leaf)" -ForegroundColor Green
        return $true
    }
    return $false
}

# Update pages
$pagesFiles = Get-ChildItem -Path $pagesPath -Filter "*.tsx"
$updatedCount = 0

Write-Host "Updating Pages..." -ForegroundColor Cyan
foreach ($file in $pagesFiles) {
    if (Update-ThemeInFile -filePath $file.FullName) {
        $updatedCount++
    }
}

# Update components  
$componentFiles = Get-ChildItem -Path $componentsPath -Filter "*.tsx"
Write-Host "`nUpdating Components..." -ForegroundColor Cyan
foreach ($file in $componentFiles) {
    if (Update-ThemeInFile -filePath $file.FullName) {
        $updatedCount++
    }
}

Write-Host "`nTotal files updated: $updatedCount" -ForegroundColor Yellow
Write-Host "Theme update complete! All pages now support light/dark mode." -ForegroundColor Green
