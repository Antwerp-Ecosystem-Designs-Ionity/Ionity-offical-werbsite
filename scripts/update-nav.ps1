$base = "e:\-REPOSITORY-IONITY-\Websites\Ionity\Ionity-offical-werbsite"

# Get all HTML files except what-we-do.html (already updated)
$htmlFiles = Get-ChildItem "$base\*.html" | Where-Object { $_.Name -ne "what-we-do.html" }

Write-Host "Found $($htmlFiles.Count) HTML files to update"
Write-Host "============================================="

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern 1: Services (non-active) then Products (non-active) - most common
    # Handles various whitespace/indentation
    $content = $content -replace '(\s*)<a href="services\.html">Services</a>\s*\r?\n\s*<a href="products\.html">Products</a>', '$1<a href="what-we-do.html">What We Do</a>'
    
    # Pattern 2: Services (active) then Products (non-active) - on services.html
    $content = $content -replace '(\s*)<a href="services\.html" class="active">Services</a>\s*\r?\n\s*<a href="products\.html">Products</a>', '$1<a href="what-we-do.html">What We Do</a>'
    
    # Pattern 3: Services (non-active) then Products (active) - on products.html  
    $content = $content -replace '(\s*)<a href="services\.html">Services</a>\s*\r?\n\s*<a href="products\.html" class="active">Products</a>', '$1<a href="what-we-do.html">What We Do</a>'
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "[UPDATED] $($file.Name)"
    } else {
        Write-Host "[NO CHANGE] $($file.Name)"
    }
}

Write-Host ""
Write-Host "============================================="
Write-Host "Nav update complete!"
