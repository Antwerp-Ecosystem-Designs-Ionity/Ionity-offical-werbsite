$base = "e:\-REPOSITORY-IONITY-\Websites\Ionity\Ionity-offical-werbsite"

# Read both source files as line arrays
$servLines = Get-Content "$base\services.html"
$prodLines = Get-Content "$base\what-we-do.html"

Write-Host "Products lines: $($prodLines.Count)"
Write-Host "Services lines: $($servLines.Count)"

# ═══════════════════════════════════════════════
# STEP 1: Find services-specific head CSS boundaries
# ═══════════════════════════════════════════════
# The unique styles start at "SUBSCRIPTION TIER STYLES" and go to </style>
$tierStart = -1
$tierStyleEnd = -1
for ($i = 0; $i -lt $servLines.Count; $i++) {
    if ($servLines[$i] -match 'SUBSCRIPTION TIER') { $tierStart = $i }
    if ($tierStart -gt 0 -and $servLines[$i] -match '^\s*</style>' -and $i -gt $tierStart) {
        $tierStyleEnd = $i
        break
    }
}
Write-Host "Services unique CSS: lines $tierStart to $tierStyleEnd"

# Extract the unique services CSS (tier cards, slider, 3D cards, holo, etc.)
$uniqueCSS = ($servLines[$tierStart..($tierStyleEnd - 1)]) -join "`r`n"

# Also get the mobile responsive <style> block from services head
$mobileStyleStart = -1
$mobileStyleEnd = -1
$inHead = $true
for ($i = $tierStyleEnd + 1; $i -lt $servLines.Count; $i++) {
    if ($servLines[$i] -match '</head>') { break }
    if ($servLines[$i] -match '<!-- Mobile Responsive') { $mobileStyleStart = $i }
    if ($mobileStyleStart -gt 0 -and $servLines[$i] -match '<style>') { $mobileStyleStart = $i + 1 }
    if ($mobileStyleStart -gt 0 -and $i -gt $mobileStyleStart -and $servLines[$i] -match '^\s*</style>') {
        $mobileStyleEnd = $i
        break
    }
}

$mobileCSS = ""
if ($mobileStyleStart -gt 0 -and $mobileStyleEnd -gt 0) {
    $mobileCSS = ($servLines[$mobileStyleStart..($mobileStyleEnd - 1)]) -join "`r`n"
    Write-Host "Services mobile CSS: lines $mobileStyleStart to $mobileStyleEnd"
}

# ═══════════════════════════════════════════════
# STEP 2: Find services body content boundaries
# ═══════════════════════════════════════════════
$deckStart = -1
$footerComment = -1
for ($i = 0; $i -lt $servLines.Count; $i++) {
    if ($deckStart -eq -1 -and $servLines[$i] -match 'deck-wrapper') { $deckStart = $i }
    if ($deckStart -gt 0 -and $servLines[$i] -match '<!-- Footer -->') { $footerComment = $i; break }
}
Write-Host "Services body content: lines $deckStart to $footerComment"

# Extract services body content (deck-wrapper + sections + inline styles + carousel JS)
$servicesBody = ($servLines[$deckStart..($footerComment - 1)]) -join "`r`n"

# ═══════════════════════════════════════════════
# STEP 3: Build merged file
# ═══════════════════════════════════════════════
$output = [System.Text.StringBuilder]::new()

# Find key line numbers in products/what-we-do
$prodHeadEnd = -1
$prodLastStyleEnd = -1
$prodFooterStart = -1
$prodBodyClose = -1

for ($i = 0; $i -lt $prodLines.Count; $i++) {
    if ($prodLines[$i] -match '</head>') { $prodHeadEnd = $i }
}

# Find last </style> before </head>
for ($i = $prodHeadEnd - 1; $i -ge 0; $i--) {
    if ($prodLines[$i] -match '</style>') { $prodLastStyleEnd = $i; break }
}

# Find first <footer> in products
for ($i = 0; $i -lt $prodLines.Count; $i++) {
    if ($prodLines[$i] -match '^\s*<footer>') { $prodFooterStart = $i; break }
}

Write-Host "Products head ends: $prodHeadEnd, last style: $prodLastStyleEnd, footer: $prodFooterStart"

# Build the output
for ($i = 0; $i -lt $prodLines.Count; $i++) {
    # Insert services CSS before the closing </style> in the head
    if ($i -eq $prodLastStyleEnd) {
        [void]$output.AppendLine("")
        [void]$output.AppendLine("        /* ═══════ SERVICES-SPECIFIC STYLES (MERGED) ═══════ */")
        [void]$output.AppendLine($uniqueCSS)
        if ($mobileCSS) {
            [void]$output.AppendLine("")
            [void]$output.AppendLine("        /* Services Mobile Responsive */")
            [void]$output.AppendLine($mobileCSS)
        }
    }
    
    # Insert services body content before <footer>
    if ($i -eq $prodFooterStart) {
        [void]$output.AppendLine("")
        [void]$output.AppendLine("    <!-- ═══════════════════════════════════════════════════════════ -->")
        [void]$output.AppendLine("    <!-- ═══════ SERVICES CONTENT (MERGED FROM SERVICES.HTML) ═══════ -->")
        [void]$output.AppendLine("    <!-- ═══════════════════════════════════════════════════════════ -->")
        [void]$output.AppendLine("")
        [void]$output.AppendLine($servicesBody)
        [void]$output.AppendLine("")
    }
    
    [void]$output.AppendLine($prodLines[$i])
}

# Write the merged file
$result = $output.ToString()
[System.IO.File]::WriteAllText("$base\what-we-do.html", $result, [System.Text.Encoding]::UTF8)

Write-Host "`nMerged file written. Total lines: $(($result -split "`n").Count)"
Write-Host "Done!"
