# Fix Database Connection Script

Write-Host "Checking .env file..." -ForegroundColor Cyan

# Read the .env file
$envContent = Get-Content ".env" -Raw

# Check current database
if ($envContent -match 'clickstay1') {
    Write-Host "❌ Still using clickstay1 database" -ForegroundColor Red
    Write-Host "Updating to clickstay_db..." -ForegroundColor Yellow
    
    $envContent = $envContent -replace 'clickstay1', 'clickstay_db'
    $envContent | Set-Content ".env" -NoNewline
    
    Write-Host "✅ Updated .env file" -ForegroundColor Green
} elseif ($envContent -match 'clickstay_db') {
    Write-Host "✅ Already using clickstay_db" -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not find database name in .env" -ForegroundColor Yellow
}

Write-Host "`nPulling schema from clickstay_db..." -ForegroundColor Cyan
npx prisma db pull --force

Write-Host "`nGenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "`n✅ Done! Restart your dev server (Ctrl+C then npm run dev)" -ForegroundColor Green
