# 🐳 Docker Deployment Guide

Complete guide for deploying Manuel Online Booking System using Docker.

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 2GB free RAM
- Port 3000 and 5432 available

## 🚀 Quick Start (Local Testing)

### 1. Generate NextAuth Secret

```bash
# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# On Mac/Linux
openssl rand -base64 32
```

### 2. Create Environment File

Copy the example and update values:

```bash
cp .env.docker .env
```

Edit `.env` and set:
- `NEXTAUTH_SECRET` - paste the generated secret from step 1
- `SMTP_*` - (optional) email configuration for booking confirmations
- `PAYMONGO_*` - (optional) payment gateway keys

### 3. Build and Run

```bash
# Build the Docker images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 4. Access Your Application

- **Application**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
  - Email: `admin@clickstay.local`
  - Password: `admin123` (or your `ADMIN_PASSWORD`)

### 5. Stop Services

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v
```

---

## ☁️ Cloud Deployment Options

### Option 1: AWS ECS (Elastic Container Service)

**Steps:**
1. Push image to Amazon ECR
2. Create ECS cluster
3. Create task definition
4. Create service with load balancer
5. Use RDS for PostgreSQL

**Estimated Cost:** ~$15-30/month

### Option 2: DigitalOcean App Platform

**Steps:**
1. Push code to GitHub
2. Create new App in DigitalOcean
3. Connect your repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

**Estimated Cost:** $12/month (Basic)

### Option 3: Google Cloud Run

**Steps:**
1. Build image: `docker build -t gcr.io/PROJECT-ID/clickstay .`
2. Push to GCR: `docker push gcr.io/PROJECT-ID/clickstay`
3. Deploy to Cloud Run
4. Connect Cloud SQL (PostgreSQL)

**Estimated Cost:** ~$7-15/month (pay per use)

### Option 4: Azure Container Instances

**Steps:**
1. Create container registry
2. Push image to ACR
3. Create container instance
4. Add Azure Database for PostgreSQL
5. Configure environment variables

**Estimated Cost:** ~$15-25/month

### Option 5: Self-Hosted VPS (DigitalOcean, Linode, Vultr)

**Best for full control and lowest cost**

#### Requirements:
- Ubuntu 22.04 LTS
- 2GB RAM minimum (4GB recommended)
- 20GB storage
- SSH access

#### Installation Steps:

```bash
# 1. Connect to your server
ssh root@your-server-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Install Docker Compose
apt-get update
apt-get install docker-compose-plugin

# 4. Clone your repository
git clone https://github.com/nokret4-bit/my-testing-app.git
cd my-testing-app

# 5. Create .env file
nano .env
# Paste your environment variables (see .env.docker)
# IMPORTANT: Change NEXTAUTH_URL to your domain/IP

# 6. Generate strong passwords
DB_PASSWORD=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
# Add these to your .env file

# 7. Build and start
docker-compose up -d

# 8. Check logs
docker-compose logs -f

# 9. (Optional) Setup Nginx reverse proxy for HTTPS
apt install nginx certbot python3-certbot-nginx
# Configure nginx to proxy to localhost:3000
```

**Estimated Cost:** $6-12/month

---

## 🔧 Advanced Configuration

### Custom Domain Setup

1. **Update Environment Variables:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Setup Nginx Reverse Proxy:**

Create `/etc/nginx/sites-available/clickstay`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Enable Site and Get SSL:**
```bash
ln -s /etc/nginx/sites-available/clickstay /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d yourdomain.com
```

### Production Environment Variables

For production, set these in your `.env`:

```env
# Strong passwords (generate with openssl rand -base64 32)
DB_PASSWORD=<strong-random-password>
NEXTAUTH_SECRET=<strong-random-secret>
ADMIN_PASSWORD=<strong-admin-password>

# Your domain
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Email (required for bookings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Database Backups

**Automated Daily Backups:**

```bash
# Create backup script
cat > /root/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
docker exec clickstay-db pg_dump -U postgres clickstay_db | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /root/backup-db.sh

# Add to crontab (runs daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /root/backup-db.sh
```

**Manual Backup:**
```bash
docker exec clickstay-db pg_dump -U postgres clickstay_db > backup.sql
```

**Restore from Backup:**
```bash
docker exec -i clickstay-db psql -U postgres clickstay_db < backup.sql
```

---

## 🔍 Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Just the app
docker-compose logs -f app

# Just the database
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100
```

### Check Resource Usage

```bash
docker stats
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Check if migrations ran
docker-compose logs app | grep prisma
```

### Restart Services

```bash
# Restart app only
docker-compose restart app

# Restart all
docker-compose restart
```

---

## 🐛 Troubleshooting

### App won't start

```bash
# Check logs
docker-compose logs app

# Common issues:
# 1. Database not ready - wait 30 seconds and retry
# 2. NEXTAUTH_SECRET not set - check .env
# 3. Port 3000 in use - change port in docker-compose.yml
```

### Database connection errors

```bash
# Check database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Test connection
docker exec clickstay-db psql -U postgres -c "SELECT 1"
```

### Can't login as admin

```bash
# Re-run seed
docker-compose exec app npm run prisma:seed

# Or manually create admin
docker-compose exec app npm run create-admin
```

### Port already in use

```yaml
# In docker-compose.yml, change port mapping
ports:
  - "8080:3000"  # Use port 8080 instead of 3000
```

---

## 📊 Performance Optimization

### Production Optimizations

1. **Enable Caching** - Use Redis for session storage
2. **CDN** - Use Cloudflare for static assets
3. **Database Tuning** - Increase PostgreSQL max_connections
4. **Load Balancing** - Run multiple app containers

### Scaling Horizontally

```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      replicas: 3  # Run 3 instances
```

---

## 🔐 Security Checklist

- [ ] Change default passwords
- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS with SSL certificate
- [ ] Setup firewall (allow only 80, 443, 22)
- [ ] Regular security updates: `apt update && apt upgrade`
- [ ] Enable automatic backups
- [ ] Use environment variables, never commit .env
- [ ] Implement rate limiting (Cloudflare)
- [ ] Regular database backups

---

## 💰 Cost Comparison

| Provider | Monthly Cost | Includes | Best For |
|----------|--------------|----------|----------|
| **VPS (Self-hosted)** | $6-12 | Server only | Full control, lowest cost |
| **DigitalOcean App** | $12 | App + DB | Simplicity |
| **AWS ECS** | $15-30 | App + RDS | Scalability |
| **Google Cloud Run** | $7-15 | Pay per use | Variable traffic |
| **Render** | $0-7 | App + DB | Quick start, testing |

---

## 📞 Support

For issues with Docker deployment:
1. Check logs: `docker-compose logs`
2. Review this guide's troubleshooting section
3. Verify all environment variables are set correctly
4. Ensure ports 3000 and 5432 are available

**Useful Commands:**
```bash
# Complete reset (⚠️ deletes all data)
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# View all running containers
docker ps

# Access database shell
docker exec -it clickstay-db psql -U postgres -d clickstay_db

# Access app shell
docker exec -it clickstay-app sh
```

---

## 🎉 Success!

Once deployed, your application will be accessible at your configured URL with:
- Full booking system
- Admin dashboard
- Email notifications
- Payment processing (if configured)
- Responsive design
- PostgreSQL database with automatic migrations

Enjoy your self-hosted Manuel Online Booking System! 🏖️
