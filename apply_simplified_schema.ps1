# After running complete_reset.sql in pgAdmin, run this script

Write-Host "Pulling simplified schema from database..." -ForegroundColor Cyan
npx prisma db pull --force

Write-Host "`nGenerating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

Write-Host "`n✅ Done! Your app should now work with the simplified schema." -ForegroundColor Green
Write-Host "The database now has only 4 tables: users, facilities, bookings, payments" -ForegroundColor Green
