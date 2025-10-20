# 🔄 Update Database Name to clickstay_db

## Step 1: Update your .env file

Open your `.env` file and change the DATABASE_URL to use `clickstay_db`:

```env
DATABASE_URL="postgresql://username:password@localhost:5433/clickstay_db?schema=public"
```

**Replace:**
- `username` - Your PostgreSQL username (usually `postgres`)
- `password` - Your PostgreSQL password
- `localhost:5433` - Your PostgreSQL host and port
- `clickstay_db` - Your new database name

---

## Step 2: Create the new database in pgAdmin

1. Open **pgAdmin**
2. Right-click on **Databases** → **Create** → **Database**
3. Name it: `clickstay_db`
4. Click **Save**

---

## Step 3: Run the reset script

1. Right-click on **clickstay_db** → **Query Tool**
2. Open the file: `complete_reset.sql`
3. Click **Execute** (F5)

---

## Step 4: Update Prisma

Run these commands in your terminal:

```powershell
npx prisma db pull --force
npx prisma generate
```

---

## ✅ Done!

Your application will now use the `clickstay_db` database with the simplified 4-table schema:
- **users** - Customer and staff accounts
- **facilities** - Rooms, cottages, halls
- **bookings** - Reservations
- **payments** - Payment records
