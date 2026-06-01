# 🚀 Complete Setup Guide - Medicxus Platform

This guide provides step-by-step instructions to get the Medicxus Group Corporate Portfolio Platform running on your local machine and ready for deployment.

---

## ✅ Pre-Installation Checklist

Before you begin, ensure you have:

- [ ] **Node.js** 18.17 or higher installed ([Download](https://nodejs.org))
- [ ] **npm** or **yarn** package manager (comes with Node.js)
- [ ] **MySQL** 8.0+ database server running ([Download](https://dev.mysql.com/downloads/mysql/))
- [ ] **Git** installed for version control ([Download](https://git-scm.com))
- [ ] A code editor like **VS Code** ([Download](https://code.visualstudio.com))
- [ ] Database client like **MySQL Workbench** or **DBeaver** (optional but helpful)

Verify installations:
```bash
node --version        # Should be v18.17 or higher
npm --version         # Should be v9 or higher
mysql --version       # Should show MySQL version
git --version         # Should show git version
```

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the project
git clone <your-repository-url>
cd BUSINESSPORTFOLIO

# Check git status
git status
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# Verify installation
npm list --depth=0
```

This will install:
- Next.js 15 framework
- React 19 RC
- Prisma ORM
- NextAuth authentication
- Tailwind CSS
- And all other dependencies

---

## 🗄️ Step 3: Database Setup

### 3.1 Create MySQL Database

Open MySQL command line or your preferred database client:

```sql
-- Create database with UTF-8 support
CREATE DATABASE businessportfoliomadixcusdata 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES;
```

### 3.2 Configure Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the DATABASE_URL:

```env
# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/businessportfoliomadixcusdata?connection_limit=20&pool_timeout=10000"

# Generate a secure NextAuth secret (min 32 chars)
# Use: openssl rand -base64 32 (on Mac/Linux) or use an online generator
NEXTAUTH_SECRET="your-generated-secret-key-here"

# Development settings
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"

# Optional: Upload directory
UPLOAD_DIR="./public/uploads"
```

**Important Notes:**
- Replace `root` and `your_password` with your actual MySQL credentials
- Generate a unique `NEXTAUTH_SECRET` for each environment
- Never commit `.env.local` to git (it's in `.gitignore`)

### 3.3 Run Prisma Migrations

Initialize the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Verify database schema
npx prisma studio
```

### 3.4 Seed Demo Data

Populate the database with demo data:

```bash
npm run seed
```

This will create:
- **Admin User**: Username: `admin`, Password: `MedicxusAdmin2026!`
- **4 Business Divisions** with related data
- **6 IT Services Projects**
- **3 Sample FAQs**
- **1 Sample Testimonial**
- **Global Settings**

---

## 🚀 Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled successfully
```

Navigate to:
- **Public Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Login Page**: http://localhost:3000/login

---

## 🔐 Step 5: First Login

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Enter credentials:
   - Username: `admin`
   - Password: `MedicxusAdmin2026!`
3. ✅ You should be redirected to the admin dashboard

⚠️ **IMPORTANT**: Change the default password immediately in production!

---

## 📝 Step 6: Start Managing Content

### Create a New Business Division

1. Go to **Admin → Business Units**
2. Click **+ Add New Division**
3. Fill in:
   - **Title**: e.g., "Medical Institute"
   - **Slug**: e.g., "medical-institute"
   - **Description**: Division details
   - **Icon**: Choose emoji or Unicode character
   - **Icon Color**: Select theme color
4. Click **Save Division**

### Add a New Project

1. Go to **Admin → Project Grid**
2. Click **+ Add New Project**
3. Fill in all required fields
4. Upload thumbnail image
5. Set target URL (where users will be redirected)
6. Configure SEO metadata
7. Click **Save Project**

### Manage FAQs

1. Go to **Admin → FAQs Manager**
2. Add, edit, or delete FAQ entries
3. Control display order with sort numbers

### View Contact Inquiries

1. Go to **Admin → Contact Leads**
2. Review submitted contact forms
3. Add administrative notes
4. Mark as read/unread

---

## 🎨 Step 7: Customize Design

The platform uses the **Sovereign Blue** design system.

### Update Colors

Edit [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  navy: {
    DEFAULT: "#0F4C81",        // Primary brand color
    hover: "#0a3a65",
  },
  teal: {
    DEFAULT: "#14B8A6",        // Accent color
    light: "#F0FDFA",
  },
  // ... more colors
}
```

### Customize Hero Section

Update content via Admin → Hero Section:
- Badge text
- Main heading
- Subtitle
- CTA button labels

### Modify Footer Content

Edit [src/components/main/footer.tsx] footer links and information.

---

## 📊 Step 8: Database Backup & Recovery

### Backup Database

```bash
# Export database to SQL file
mysqldump -u root -p businessportfoliomadixcusdata > backup.sql

# Backup with timestamp
mysqldump -u root -p businessportfoliomadixcusdata > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from SQL file
mysql -u root -p businessportfoliomadixcusdata < backup.sql
```

---

## 🧪 Step 9: Testing

### Test Public Pages

- [ ] Homepage loads correctly
- [ ] All sections display properly
- [ ] Links work (hero buttons, navbar)
- [ ] Responsive design on mobile
- [ ] Contact form submits successfully

### Test Admin Functions

- [ ] Login with credentials
- [ ] Create/edit/delete divisions
- [ ] Create/edit/delete projects
- [ ] Manage testimonials
- [ ] View contact inquiries
- [ ] Update settings

### Test API Endpoints

```bash
# Test division list API
curl http://localhost:3000/api/divisions

# Test project list API
curl http://localhost:3000/api/projects

# Test FAQ list API
curl http://localhost:3000/api/faqs

# Submit test inquiry
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123-456-7890",
    "subject": "Test Inquiry",
    "message": "This is a test message"
  }'
```

---

## 🔒 Step 10: Security Configuration

### Enable HTTPS

For production, use HTTPS. Update `NEXTAUTH_URL`:

```env
NEXTAUTH_URL="https://medicxus.com"
```

### Update NextAuth Secret

Generate a new secret for each environment:

```bash
# Generate secure secret
openssl rand -base64 32
```

### Set Secure Database Password

Change default MySQL password:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_strong_password';
FLUSH PRIVILEGES;
```

### Configure Security Headers

Headers are configured in [src/middleware.ts]:
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff
- Content-Security-Policy
- Referrer-Policy

---

## 🚢 Step 11: Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

### Docker Deployment

Build and run Docker container:

```bash
# Build Docker image
docker build -t medicxus-platform:latest .

# Run container
docker run -d \
  --name medicxus \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e NEXTAUTH_SECRET="..." \
  medicxus-platform:latest
```

### Deploy to Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

Configure environment variables in Vercel dashboard.

### Deploy to AWS, DigitalOcean, or Heroku

Refer to respective platform documentation and ensure:
- MySQL database is accessible
- All environment variables are set
- SSL certificates are configured
- Domain is pointed to server

---

## 📈 Step 12: Monitor & Maintain

### View Database

```bash
# Open Prisma Studio
npx prisma studio

# Access at http://localhost:5555
```

### Check Logs

```bash
# View Next.js build logs
npm run build

# View runtime errors
npm run dev
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Major version updates
npm install package@latest
```

---

## 🐛 Troubleshooting

### MySQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
```bash
# Start MySQL server
# On Mac with Homebrew:
brew services start mysql

# On Windows:
# Open Services > MySQL80 > Start

# On Linux:
sudo systemctl start mysql
```

### Port 3000 Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Kill process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run dev
```

### Prisma Migration Error

**Error**: `The database connection string is invalid`

**Solution**:
```bash
# Verify DATABASE_URL format
# Check MySQL credentials
# Ensure database exists

mysql -u root -p -e "SHOW DATABASES;"
```

### Uploads Directory Missing

**Error**: `ENOENT: no such file or directory, open './public/uploads/...'`

**Solution**:
```bash
# Create uploads directory
mkdir -p public/uploads

# Set proper permissions
chmod 755 public/uploads
```

---

## ✨ Next Steps

After successful setup:

1. **Customize branding** - Update colors, fonts, and assets
2. **Add your content** - Create divisions and projects
3. **Setup analytics** - Integrate Google Analytics
4. **Configure email** - Set up transactional emails
5. **Deploy to production** - Follow deployment steps above
6. **Monitor performance** - Use Next.js Analytics

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

---

## 🆘 Support

For technical issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review logs: `npm run dev` output
3. Check database: `npx prisma studio`
4. Review browser console for frontend errors

For other inquiries: **admin@medicxus.com**

---

**Last Updated**: June 1, 2026  
**Version**: 1.0.0 - Setup Guide
