# 🔑 API Keys Configuration Guide

## Required API Keys

### 1. Razorpay Payment Gateway

**Purpose**: Process online payments for mess fees

**Steps to Get Keys:**

1. **Sign Up**
   - Visit: https://razorpay.com/
   - Click "Sign Up" and create account
   - Verify email and complete KYC (for Live mode)

2. **Get Test Keys (Development)**
   - Login to Dashboard
   - Go to: **Settings → API Keys**
   - Click "Generate Test Key"
   - You'll see:
     - `Key ID` (starts with `rzp_test_`)
     - `Key Secret` (click "show" to reveal)

3. **Add to Backend**
   ```env
   # backend/.env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
   ```

4. **Test Card Details** (for development)
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

5. **Go Live (Production)**
   - Complete KYC verification
   - Submit business documents
   - Get approval from Razorpay
   - Generate Live Keys (starts with `rzp_live_`)

**Documentation**: https://razorpay.com/docs/

---

### 2. Google Maps JavaScript API

**Purpose**: Display interactive maps with delivery tracking

**Steps to Get API Key:**

1. **Create Google Cloud Project**
   - Visit: https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Enter project name: "MessMate"
   - Click "Create"

2. **Enable Maps JavaScript API**
   - In Cloud Console, go to: **APIs & Services → Library**
   - Search for: "Maps JavaScript API"
   - Click on it and press "Enable"

3. **Create API Key**
   - Go to: **APIs & Services → Credentials**
   - Click: "Create Credentials" → "API Key"
   - Your API key will be generated
   - Copy the key (starts with `AIza...`)

4. **Restrict API Key (Recommended)**
   - Click on your API key name
   - Under "API restrictions":
     - Select "Restrict key"
     - Check "Maps JavaScript API"
   - Under "Application restrictions":
     - For development: Choose "None"
     - For production: Choose "HTTP referrers" and add your domain
   - Click "Save"

5. **Add to Frontend**
   ```env
   # frontend/.env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

6. **Enable Billing (Required)**
   - Google Maps requires billing to be enabled
   - Go to: **Billing → Link a billing account**
   - Add credit card (Google provides $200 free credit monthly)
   - Maps usage within free tier won't be charged

**Free Tier Limits**:
- Static Maps: 28,000 loads/month free
- Dynamic Maps: $7 per 1,000 loads (after $200 credit)
- For most small apps, you'll stay within free tier

**Documentation**: https://developers.google.com/maps/documentation

---

## Current Configuration Status

### Backend (.env)
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_key_change_me_in_production
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Priy@2006
DB_NAME=messmate

# ⚠️ ADD YOUR KEYS BELOW
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_API_ORIGIN=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# ⚠️ ADD YOUR KEY BELOW
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

---

## Testing Without API Keys

### Razorpay (Payments)
**Fallback Behavior**:
- Payment button will show error: "Razorpay SDK failed to load"
- Backend will return error if keys are invalid
- **Workaround**: Use placeholder keys to test flow (payment will fail but UI/flow can be tested)

### Google Maps
**Fallback Behavior**:
- Map component shows error message
- Message: "Failed to load map. Check your API key."
- Displays instructions to add key to .env
- **Workaround**: App will work, but map won't display

---

## Quick Setup Commands

### 1. Clone and Install
```powershell
cd "c:\Users\aggra\Downloads\MessMate – Smart Mess Management & Tiffin Tracking System"

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure API Keys
```powershell
# Edit backend/.env
notepad backend\.env

# Edit frontend/.env
notepad frontend\.env
```

### 3. Start Servers
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Test Application
- Open browser: http://localhost:5173
- Login with test credentials
- Navigate to Payments page (students)
- Navigate to Delivery page to see map

---

## Security Best Practices

### ✅ DO:
- Keep API keys in `.env` files (never commit to Git)
- Use Test keys for development
- Restrict Google Maps API key to specific domains
- Enable billing alerts on Google Cloud
- Rotate keys if exposed
- Use environment-specific keys (dev/staging/prod)

### ❌ DON'T:
- Hardcode keys in source code
- Commit `.env` files to version control
- Share keys in public forums/chat
- Use Live Razorpay keys in development
- Leave Google Maps API key unrestricted in production

---

## Billing & Costs

### Razorpay
- **Pricing**: 2% per transaction (India)
- **No setup fee**
- **No monthly charges**
- **Settlement**: T+2 days to bank account

### Google Maps
- **Free Tier**: $200 credit per month
- **Maps Load**: $7 per 1,000 loads (after credit)
- **Most small apps**: Stay within free tier
- **Set budget alerts**: Prevent unexpected charges

---

## Support Resources

### Razorpay
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com
- Discord: https://razorpay.com/discord

### Google Maps
- Documentation: https://developers.google.com/maps
- Support: Google Cloud Console → Support
- Stack Overflow: [google-maps] tag

---

## Common Issues

### "Razorpay script failed to load"
✅ Check keys in backend/.env
✅ Restart backend server after adding keys
✅ Check browser console for errors

### "Failed to load map"
✅ Verify key in frontend/.env starts with `VITE_`
✅ Restart Vite dev server (Ctrl+C, then npm run dev)
✅ Check Maps JavaScript API is enabled
✅ Ensure billing is enabled on Google Cloud

### "Payment signature verification failed"
✅ Ensure RAZORPAY_KEY_SECRET matches dashboard
✅ Don't mix Test and Live keys
✅ Check server logs for signature mismatch

---

## Next Steps

1. ✅ Database migrations applied
2. ✅ All dependencies installed
3. ⚠️ Add Razorpay keys to `backend/.env`
4. ⚠️ Add Google Maps key to `frontend/.env`
5. ⚠️ Restart both servers after adding keys
6. ✅ Test the application

**Once keys are added, all features will work perfectly!** 🎉
