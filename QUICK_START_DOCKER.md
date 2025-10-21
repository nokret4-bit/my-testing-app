# 🚀 Quick Start - Docker Deployment

Get your booking system running in **5 minutes**!

## ⚡ Super Quick Start (Copy-Paste)

```bash
# 1. Generate secret (Windows PowerShell)
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
echo "Your NEXTAUTH_SECRET: $secret"

# 2. Create .env file
@"
DB_PASSWORD=admin123
NEXTAUTH_SECRET=$secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=admin123
"@ | Out-File -FilePath .env -Encoding UTF8

# 3. Build and run
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

## 🖥️ For Mac/Linux Users

```bash
# 1. Generate secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Your NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

# 2. Create .env file
cat > .env << EOF
DB_PASSWORD=admin123
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PASSWORD=admin123
EOF

# 3. Build and run
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

## 📱 Access Your App

Wait 2-3 minutes for the build to complete, then:

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Email: `admin@clickstay.local`
  - Password: `admin123`

## 🎯 What Happens Automatically

1. ✅ PostgreSQL database starts
2. ✅ Next.js app builds
3. ✅ Database migrations run
4. ✅ Database seeded with:
   - Admin user
   - 6 sample facilities (rooms, cottages, hall)
5. ✅ App starts on port 3000

## 🛑 Stop Everything

```bash
docker-compose down
```

## 🔄 Restart

```bash
docker-compose restart
```

## 📊 View Logs

```bash
# All logs
docker-compose logs -f

# Just app logs
docker-compose logs -f app

# Just database logs
docker-compose logs -f db
```

## ⚠️ Troubleshooting

### "Port 3000 already in use"

```bash
# Change port in docker-compose.yml
# Under app > ports, change to:
- "8080:3000"  # Use port 8080 instead
```

### "Can't connect to database"

```bash
# Wait 30 seconds and try again
# Or check if database is running:
docker-compose ps
```

### "Build failed"

```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📖 Full Documentation

See [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) for:
- Cloud deployment options
- Custom domain setup
- Production configuration
- Backup strategies
- Advanced troubleshooting

## 🎉 That's It!

Your booking system is now running! Start by:
1. Logging into admin panel
2. Checking the sample facilities
3. Making a test booking
4. Customizing for your resort

Happy hosting! 🏖️
