# MessMate – Smart Mess Management & Tiffin Tracking System

## 🚀 Enhanced Production-Ready Features

### New Features Added ✨

#### 1. **Razorpay Payment Gateway Integration** 💳
- Secure online payment for mess fees
- Payment verification with signature validation
- Payment history tracking
- Real-time payment status updates
- Students can pay mess fees directly through the app

#### 2. **Delivery List Management** 🚚
- Admin can view today's delivery list filtered by meal type (breakfast/lunch/dinner)
- Shows all students who haven't skipped meals
- Displays student details: name, room number, phone, email
- Real-time delivery status tracking (pending/on_the_way/delivered)
- Daily delivery count statistics

#### 3. **Enhanced Chat System** 💬
- **General Group Chat**: All students and admin can communicate
- **Private Chat**: One-on-one messaging between students and admin
- User selection for private conversations
- Real-time message delivery using Socket.io
- Message timestamps and sender identification
- Beautiful animated UI with Framer Motion

#### 4. **Google Maps Live Tracking** 🗺️
- Interactive Google Maps JavaScript API integration
- Custom delivery rider marker icon
- Real-time location updates
- Smooth marker animations
- Info window with delivery person details
- Map auto-panning when location updates

#### 5. **Modern Animated UI** ✨
- Framer Motion animations throughout the app
- Heroicons for beautiful, consistent icons
- Animated stat cards with hover effects
- Gradient backgrounds and smooth transitions
- Enhanced dashboard with color-coded cards
- Loading states with spinners
- Responsive design for all screen sizes

#### 6. **Enhanced Security** 🔒
- JWT token-based authentication
- Bcrypt password hashing
- Role-based access control (admin/student)
- Payment signature verification
- SQL injection prevention with parameterized queries
- CORS protection
- Helmet security headers

---

## 📦 Tech Stack

### Frontend
- **React 19.2** - Modern UI library
- **Vite 5.4** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Heroicons** - Beautiful SVG icons
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Google Maps JS API Loader** - Interactive maps

### Backend
- **Node.js + Express 5.2** - Server framework
- **MySQL 9.4** - Relational database
- **Socket.io 4.8** - WebSocket server
- **JWT** - Token authentication
- **Bcrypt** - Password hashing
- **Razorpay SDK** - Payment processing
- **Multer** - File uploads
- **Express Validator** - Input validation

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL 9.4
- Razorpay Account (for payments)
- Google Cloud Account (for Maps API)

### 1. Clone Repository
```bash
cd "c:\Users\aggra\Downloads\MessMate – Smart Mess Management & Tiffin Tracking System"
```

### 2. Backend Setup

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Database setup (already done - messmate database exists)
# If you need to reset: mysql -u root -p < database/schema.sql
# Then run: mysql -u root -p messmate < database/migrations.sql
```

**Configure backend/.env:**
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

# Get from: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup

```powershell
# Navigate to frontend
cd ../frontend

# Install dependencies (already done)
# Packages installed: framer-motion, @heroicons/react, @googlemaps/js-api-loader
```

**Configure frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Get from: https://console.cloud.google.com/google/maps-apis
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 🔑 API Keys Setup Guide

### Razorpay (Payment Gateway)

1. Create account at https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys for development
4. Copy `Key ID` and `Key Secret` to backend/.env
5. For production, generate Live Keys

### Google Maps JavaScript API

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Enable **Maps JavaScript API**
4. Go to Credentials → Create Credentials → API Key
5. Restrict key to Maps JavaScript API (recommended)
6. Copy API key to frontend/.env as `VITE_GOOGLE_MAPS_API_KEY`

---

## 🚀 Running the Application

### Start Backend Server
```powershell
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```powershell
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Socket.io**: ws://localhost:5000

### Test Credentials
- **Email**: aggrawalpriyanshu399@gmail.com
- **Password**: Priy@123
- **Role**: Student

---

## 📚 New API Endpoints

### Payment APIs
```
POST   /api/payments/create-order    # Create Razorpay order
POST   /api/payments/verify          # Verify payment signature
GET    /api/payments/history         # Get payment history
```

### Delivery APIs
```
GET    /api/delivery/today?meal_type={breakfast|lunch|dinner}  # Today's delivery list
GET    /api/delivery/latest          # Latest delivery location
POST   /api/delivery/update          # Update delivery location
PATCH  /api/delivery/status          # Update delivery status
```

### Enhanced Chat APIs
```
GET    /api/chat/messages?chat_type={general|private}&receiver_id={id}  # Messages
GET    /api/chat/users               # List all users for private chat
```

### Socket.io Events
```javascript
// Client → Server
socket.emit('chatMessage', { message, chat_type, receiver_id })
socket.emit('joinPrivate', { receiverId })
socket.emit('deliveryLocation', { delivery_person_id, latitude, longitude, status, meal_type })
socket.emit('deliveryStatusChange', { status, meal_type })

// Server → Client
socket.on('chatMessage', (data) => { /* New message */ })
socket.on('deliveryUpdate', (data) => { /* Location update */ })
socket.on('deliveryStatusUpdate', (data) => { /* Status change */ })
```

---

## 🎨 New Frontend Pages

### 1. Payment Page (`/payments`)
- **Access**: Students only
- **Features**:
  - Payment form with amount and description
  - Razorpay checkout integration
  - Payment history list
  - Success/failure handling

### 2. Delivery List Page (`/delivery-list`)
- **Access**: Admin only
- **Features**:
  - Filter by meal type (breakfast/lunch/dinner)
  - Student list with contact details
  - Delivery status badges
  - Total deliveries count

### 3. Enhanced Chat Page
- **Access**: All authenticated users
- **Features**:
  - Toggle between general/private chat
  - User selection dropdown for private chat
  - Real-time messaging
  - Message timestamps
  - Animated message bubbles

### 4. Enhanced Delivery Tracking
- **Features**:
  - Interactive Google Maps
  - Custom rider marker
  - Real-time location updates
  - Info window with details

---

## 🗂️ Database Schema Updates

### New Columns Added

**delivery_tracking table**:
- `delivery_person_id` INT (FK to users)
- `meal_type` ENUM('breakfast','lunch','dinner')
- `delivery_date` DATE

**chat_messages table**:
- `receiver_id` INT (FK to users)
- `chat_type` ENUM('general','private')

**transactions table**:
- `payment_method` VARCHAR(50)
- `razorpay_order_id` VARCHAR(255)
- `razorpay_payment_id` VARCHAR(255)
- `razorpay_signature` VARCHAR(255)

---

## 🔄 Migration Applied

Database migrations have been successfully applied to add:
✅ Payment gateway fields
✅ Private chat support
✅ Enhanced delivery tracking
✅ Performance indexes

---

## 📱 Features by User Role

### Admin Dashboard
- ✅ View analytics and statistics
- ✅ Manage daily menu with image uploads
- ✅ View today's delivery list
- ✅ Track delivery location in real-time
- ✅ View student complaints and suggestions
- ✅ Manage transactions
- ✅ Chat with students (general + private)

### Student Dashboard
- ✅ View today's menu
- ✅ Skip meals (3-hour cutoff before meal time)
- ✅ Pay mess fees via Razorpay
- ✅ View payment history
- ✅ Track delivery location
- ✅ Submit complaints and suggestions
- ✅ Rate food quality
- ✅ Chat with admin and other students

---

## 🎯 Production Deployment Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable Razorpay Live Mode keys
- [ ] Restrict Google Maps API key to production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure production MySQL database
- [ ] Set up environment variables on hosting platform
- [ ] Enable CORS for production domain only
- [ ] Set up CDN for static assets
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and logging (PM2, Winston)
- [ ] Enable rate limiting for APIs
- [ ] Set up automated database backups

---

## 🐛 Troubleshooting

### Payment not working?
- Check Razorpay keys in backend/.env
- Ensure you're using Test Mode keys for development
- Check browser console for Razorpay script errors

### Maps not loading?
- Verify Google Maps API key in frontend/.env
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for API errors

### Chat messages not arriving?
- Verify Socket.io connection in browser DevTools → Network → WS
- Check backend logs for Socket.io errors
- Ensure JWT token is valid

### Database connection failed?
- Verify MySQL service is running: `Get-Service MySQL94`
- Check credentials in backend/.env
- Test connection: `mysql -u root -p messmate`

---

## 📄 License

This project is built as a comprehensive mess management system with production-ready features.

---

## 👨‍💻 Developer

**Priyanshu Agrawal**
- Email: aggrawalpriyanshu399@gmail.com

---

## 🎉 Enjoy Your Enhanced MessMate App!

All features are now production-ready with:
- 💳 Secure payments
- 🗺️ Live GPS tracking
- 💬 Real-time chat
- ✨ Beautiful animations
- 🔒 Enhanced security

Happy coding! 🚀
