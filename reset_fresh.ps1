# ═══════════════════════════════════════════════════════════════════════════
# Complete Database Reset Script
# ═══════════════════════════════════════════════════════════════════════════

Write-Host "Starting fresh database reset..." -ForegroundColor Cyan

# Step 1: Delete all migration folders
Write-Host "`n[1/4] Deleting old migrations..." -ForegroundColor Yellow
$migrationsPath = "prisma\migrations"
if (Test-Path $migrationsPath) {
    Get-ChildItem -Path $migrationsPath -Directory | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force
        Write-Host "  Deleted: $($_.Name)" -ForegroundColor Gray
    }
}

# Step 2: Run the SQL reset script in PostgreSQL
Write-Host "`n[2/4] Resetting database..." -ForegroundColor Yellow
Write-Host "  Please run 'reset_database.sql' in pgAdmin manually" -ForegroundColor Magenta
Write-Host "  OR press Enter to continue if you've already done this..." -ForegroundColor Magenta
Read-Host

# Step 3: Generate Prisma Client
Write-Host "`n[3/4] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Step 4: Create fresh migration
Write-Host "`n[4/4] Creating fresh migration..." -ForegroundColor Yellow
npx prisma migrate dev --name init --create-only

Write-Host "`n✅ Reset complete! Now run: npx prisma migrate deploy" -ForegroundColor Green
