# Render Deployment Setup Guide

Your app is deployed at: **https://clickstay.onrender.com**

## ⚠️ Current Issue

The app is crashing because environment variables are missing. Follow the steps below to fix it.

## 🔧 Step 1: Add Environment Variables

1. Go to https://dashboard.render.com
2. Select your service: **clickstay**
3. Click **Environment** in the left sidebar
4. Add the following variables:

### Required Variables

```bash
# Database - Get this from your Render PostgreSQL service
DATABASE_URL=postgresql://user:password@host/database

# NextAuth - REQUIRED (use the generated secret below)
NEXTAUTH_SECRET=8KjvgwTTPRnBEXR00P5XNbOjNQvjsUBtEwRaB3ZhMZA=
NEXTAUTH_URL=https://clickstay.onrender.com

# Email Configuration - Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=Manuel Resort <your_email@gmail.com>

# PayMongo - Use LIVE keys for production
PAYMONGO_SECRET_KEY=sk_live_your_key_here
PAYMONGO_PUBLIC_KEY=pk_live_your_key_here
PAYMONGO_WEBHOOK_SECRET=whsec_your_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://clickstay.onrender.com
NODE_ENV=production
```

## 🗄️ Step 2: Setup PostgreSQL Database

If you haven't created a database yet:

1. In Render dashboard, click **New +** → **PostgreSQL**
2. Name it: `clickstay-db`
3. Select the **Free** plan
4. Click **Create Database**
5. Once created, copy the **Internal Database URL**
6. Add it as `DATABASE_URL` in your web service environment variables

## 🔄 Step 3: Run Database Migrations

After adding the `DATABASE_URL`, you need to run migrations:

1. In your Render service, go to **Shell** tab
2. Run: `npx prisma migrate deploy`
3. This will create all the necessary database tables

## 📧 Step 4: Setup PayMongo Webhook

1. Go to [PayMongo Dashboard](https://dashboard.paymongo.com/developers/webhooks)
2. Create a new webhook:
   - **URL**: `https://clickstay.onrender.com/api/webhooks/paymongo`
   - **Events**: Select `source.chargeable`, `payment.paid`, `payment.succeeded`
3. Copy the webhook secret
4. Add it as `PAYMONGO_WEBHOOK_SECRET` in Render

## ✅ Step 5: Verify Deployment

After adding all environment variables:

1. Render will automatically redeploy
2. Wait for deployment to complete
3. Visit https://clickstay.onrender.com
4. You should see the homepage without errors

## 🔍 Troubleshooting

### Check Logs
- Go to your service → **Logs** tab
- Look for any error messages

### Common Issues

**Database Connection Error**
- Verify `DATABASE_URL` is correct
- Make sure you're using the **Internal Database URL** from Render PostgreSQL

**NextAuth Error**
- Ensure `NEXTAUTH_SECRET` is set
- Ensure `NEXTAUTH_URL` matches your Render URL exactly

**Email Not Sending**
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled on your Google account

**Payment Issues**
- For production, use **LIVE** PayMongo keys (not test keys)
- Ensure webhook is configured correctly

## 📝 Create Admin User

Once the app is running, create an admin user:

1. Go to Render Shell
2. Run:
```bash
npx tsx scripts/create-admin.ts
```

Or use the web interface at: `https://clickstay.onrender.com/admin`

## 🚀 Next Steps

1. ✅ Add all environment variables
2. ✅ Wait for automatic redeploy
3. ✅ Run database migrations
4. ✅ Create admin user
5. ✅ Configure PayMongo webhook
6. ✅ Test the application

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **PayMongo Support**: https://support.paymongo.com

---

**Your Generated Secrets:**

- **NEXTAUTH_SECRET**: `8KjvgwTTPRnBEXR00P5XNbOjNQvjsUBtEwRaB3ZhMZA=`

Keep these secrets secure and never commit them to Git!
