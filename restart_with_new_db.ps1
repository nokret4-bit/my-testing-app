# Complete Restart Script

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  RESTART WITH NEW DATABASE (clickstay_db)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Pulling schema from clickstay_db (port 5434)..." -ForegroundColor Yellow
npx prisma db pull --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Failed to pull schema. Make sure:" -ForegroundColor Red
    Write-Host "  1. PostgreSQL is running on port 5434" -ForegroundColor Red
    Write-Host "  2. Database 'clickstay_db' exists" -ForegroundColor Red
    Write-Host "  3. You ran complete_reset.sql in pgAdmin" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/4] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Failed to generate client. Stop your dev server first!" -ForegroundColor Red
    exit 1
}

Write-Host "`n[3/4] Checking schema..." -ForegroundColor Yellow
$schema = Get-Content "prisma\schema.prisma" -Raw
if ($schema -match "facilities") {
    Write-Host "✅ Found 'facilities' table (simplified schema)" -ForegroundColor Green
} elseif ($schema -match "facility_units") {
    Write-Host "⚠️  Still using old complex schema with facility_units" -ForegroundColor Yellow
} else {
    Write-Host "❌ No tables found in schema" -ForegroundColor Red
}

Write-Host "`n[4/4] Ready to start!" -ForegroundColor Yellow
Write-Host "`nNow run: " -NoNewline -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Green

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
