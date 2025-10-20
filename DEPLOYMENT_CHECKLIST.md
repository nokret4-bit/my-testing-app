# ClickStay Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint errors: `npm run lint`
- [ ] Code formatted: `npx prettier --write .`
- [ ] Git repository up to date
- [ ] All sensitive data removed from code
- [ ] `.env` not committed to Git

### Database Preparation
- [ ] Production database created
- [ ] Database URL obtained
- [ ] Database accessible from deployment platform
- [ ] Backup strategy in place

### Third-Party Services
- [ ] PayMongo account created
- [ ] PayMongo live API keys obtained
- [ ] PayMongo webhook endpoint configured
- [ ] SMTP provider configured (Gmail, SendGrid, etc.)
- [ ] SMTP credentials obtained
- [ ] Test email sending works

## Vercel Deployment

### 1. Database Setup

**Option A: Vercel Postgres**
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create
```

**Option B: External Provider (Supabase, Neon, Railway)**
- [ ] Sign up for provider
- [ ] Create database
- [ ] Get connection string
- [ ] Test connection

### 2. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables
```env
DATABASE_URL=postgresql://[production-url]
AUTH_SECRET=[generate-new-secret-for-production]
AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Email Configuration
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
USE_ETHEREAL_DEV=false
```

#### PayMongo (LIVE Keys)
```env
PAYMONGO_PUBLIC_KEY=pk_live_xxxxx
PAYMONGO_SECRET_KEY=sk_live_xxxxx
PAYMONGO_WEBHOOK_SECRET=whsec_xxxxx
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel

```bash
# Deploy
vercel --prod

# Or push to GitHub (auto-deploys if connected)
git push origin main
```

### 4. Run Database Migrations

After first deployment:

```bash
# Set DATABASE_URL locally to production
export DATABASE_URL="postgresql://[production-url]"

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### 5. Configure PayMongo Webhook

1. Go to PayMongo Dashboard → Webhooks
2. Add new webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/webhooks/paymongo`
   - Events: `source.chargeable`, `payment.paid`, `payment.failed`
3. Copy webhook secret
4. Update `PAYMONGO_WEBHOOK_SECRET` in Vercel

### 6. Test Production Deployment

- [ ] Visit production URL
- [ ] Test user registration/login
- [ ] Browse facilities
- [ ] Create test booking
- [ ] Complete test payment (use PayMongo test mode first)
- [ ] Verify email received
- [ ] Check admin dashboard
- [ ] Test all admin features

## Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Monitor database performance
- [ ] Check email delivery rates

### Security
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Review CORS settings
- [ ] Audit dependencies: `npm audit`

### Performance
- [ ] Test page load speeds (Lighthouse)
- [ ] Optimize images
- [ ] Enable caching
- [ ] Monitor database query performance
- [ ] Check API response times

### Backups
- [ ] Set up automated database backups
- [ ] Test backup restoration
- [ ] Document backup procedures
- [ ] Store backups securely

### Documentation
- [ ] Update README with production URL
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document admin procedures

## Production Checklist

### Before Going Live
- [ ] All test bookings removed
- [ ] Production data seeded
- [ ] Admin accounts created
- [ ] Staff accounts created (if applicable)
- [ ] Email templates reviewed
- [ ] Payment flow tested end-to-end
- [ ] Webhook handling tested
- [ ] Error pages customized
- [ ] 404 page customized
- [ ] Favicon updated
- [ ] SEO meta tags added
- [ ] Social media preview images set

### Launch Day
- [ ] Monitor error logs
- [ ] Watch webhook events
- [ ] Check email delivery
- [ ] Monitor payment processing
- [ ] Be available for support
- [ ] Have rollback plan ready

### Post-Launch
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Track conversion rates
- [ ] Review error logs daily
- [ ] Optimize based on usage patterns

## Rollback Plan

If issues occur:

1. **Immediate Rollback**
   ```bash
   vercel rollback
   ```

2. **Database Rollback**
   - Restore from backup
   - Run previous migration
   ```bash
   npx prisma migrate resolve --rolled-back [migration-name]
   ```

3. **Notify Users**
   - Post status update
   - Send email if needed
   - Update social media

## Common Issues

### Database Connection Errors
- Check DATABASE_URL is correct
- Verify database is accessible
- Check connection pool limits
- Review Prisma logs

### Email Not Sending
- Verify SMTP credentials
- Check SMTP_HOST and SMTP_PORT
- Test with Ethereal first
- Review email logs

### Payment Webhook Failures
- Verify webhook URL is correct
- Check PAYMONGO_WEBHOOK_SECRET
- Review webhook signature verification
- Check PayMongo dashboard for errors

### Build Failures
- Check TypeScript errors: `npm run build`
- Verify all dependencies installed
- Check Node version matches (20.18.0)
- Review build logs in Vercel

## Support Contacts

- **Vercel Support**: https://vercel.com/support
- **PayMongo Support**: support@paymongo.com
- **Database Provider**: [your-provider-support]
- **SMTP Provider**: [your-provider-support]

## Maintenance

### Weekly
- [ ] Review error logs
- [ ] Check database performance
- [ ] Monitor disk usage
- [ ] Review security alerts

### Monthly
- [ ] Update dependencies
- [ ] Review analytics
- [ ] Optimize database queries
- [ ] Backup verification test

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback review
- [ ] Feature planning

---

**Deployment Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

Last Updated: [Date]
Deployed By: [Name]
Production URL: [URL]
