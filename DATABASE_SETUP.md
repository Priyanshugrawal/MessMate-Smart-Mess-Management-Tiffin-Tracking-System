# MessMate - Database Setup Instructions

## Quick Setup (Recommended)

Run the automated setup script:

```powershell
.\setup-database.ps1
```

This will:
1. Prompt for your MySQL root password
2. Create the `messmate` database
3. Create all required tables
4. Offer to update your `backend/.env` file automatically

---

## Manual Setup (Alternative)

### Step 1: Find Your MySQL Password

Your MySQL root password was set during MySQL installation. If you forgot it:
- Check your password manager or installation notes
- Or reset it using MySQL documentation

### Step 2: Update backend/.env

Edit `backend/.env` and set your MySQL password:

```env
DB_PASSWORD=your_actual_mysql_password
```

### Step 3: Run the Schema

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p < backend/database/schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to localhost (enter your password)
3. File → Run SQL Script → Select `backend/database/schema.sql`
4. Execute

### Step 4: Restart Backend

```bash
cd backend
npm run dev
```

---

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Your MySQL root account has a password
- Update `DB_PASSWORD` in `backend/.env`
- Make sure you're using the correct password

### "Can't connect to MySQL server"
- Check MySQL service is running:
  ```powershell
  Get-Service MySQL*
  ```
- If stopped, start it:
  ```powershell
  Start-Service MySQL94
  ```

### "Unknown database 'messmate'"
- The schema.sql file hasn't been imported yet
- Run the setup script or manually import the schema

---

## Default Configuration

The project uses these MySQL settings (in `backend/.env`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # ← SET THIS
DB_NAME=messmate
```

Change these if your MySQL setup is different.
