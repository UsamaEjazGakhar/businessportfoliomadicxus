# Medicxus Group Corporate Portfolio Platform

> **Enterprise-grade CMS & Portal for a healthcare technology conglomerate**

A modern, scalable Next.js 15 application serving as the central hub, traffic gateway, and content management system for Medicxus Group's global holdings across Healthcare, Education, Consultancy, and IT Services.

---

## 🎯 Project Overview

This platform consolidates:
- **Care Institute of Health Sciences** - Medical education programs
- **Medicxus Diagnostic** - Advanced diagnostic services
- **Study Abroad MBBS Project** - International medical university consultancy
- **Healthcare IT Solutions** - Hospital software, LIMS, web development, and digital marketing

### Key Features

✅ **Public Portal** - Optimized landing page with divisions, projects, testimonials, and FAQs  
✅ **Admin CMS** - Role-based access control (Super Admin, Editor, Auditor)  
✅ **Content Management** - Manage divisions, projects, testimonials, FAQs, hero section  
✅ **Lead Management** - Contact inquiry tracking and administrative notes  
✅ **Analytics** - Click tracking on project redirects  
✅ **SEO Optimized** - Dynamic sitemaps, JSON-LD schema, meta tags  
✅ **Media Management** - Local file upload with validation  
✅ **Authentication** - NextAuth with JWT-based session management  

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (RC), Next.js 15 App Router, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MySQL 8.0+
- **Authentication**: NextAuth v4
- **Validation**: Zod
- **UI Components**: Shadcn UI, Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with Sovereign Blue design system

---

## 📋 Prerequisites

- **Node.js** 18.17+ (Recommended: 20 LTS)
- **npm** or **yarn** package manager
- **MySQL** 8.0+ server (local or remote)
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd BUSINESSPORTFOLIO
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the example environment file and update with your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/businessportfoliomadixcusdata?connection_limit=20&pool_timeout=10000"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-byte-random-secret-key-here" # Generate with: openssl rand -base64 32

# Media Upload
UPLOAD_DIR="./public/uploads"

# Node Environment
NODE_ENV="development"
```

### 4. Database Setup

**Create MySQL Database:**
```sql
CREATE DATABASE businessportfoliomadixcusdata 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

**Run Prisma Migrations:**
```bash
npx prisma migrate dev --name init
```

**Seed Database with Demo Data:**
```bash
npm run seed
# or
npx prisma db seed
```

This will create:
- Super Admin user: `admin` / `MedicxusAdmin2026!`
- 4 Business Divisions
- 6 IT Service Projects
- 3 Sample FAQs
- 1 Sample Testimonial
- Global system settings

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)

---

## 🔐 Default Credentials

After seeding the database:

```
Username: admin
Password: MedicxusAdmin2026!
```

⚠️ **CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION**

---

## 📁 Project Structure

```
medicxus-platform/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Demo data seeding script
│   └── migrations/            # SQL migration history
├── public/
│   └── uploads/               # User-uploaded media files
├── src/
│   ├── app/
│   │   ├── page.tsx           # Public landing page
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── login/page.tsx     # Authentication page
│   │   ├── admin/             # Admin dashboard routes
│   │   │   ├── layout.tsx     # Admin sidebar layout
│   │   │   ├── page.tsx       # Dashboard analytics
│   │   │   ├── divisions/     # Business units management
│   │   │   ├── projects/      # Project & link configuration
│   │   │   ├── blogs/         # Blog content management
│   │   │   ├── testimonials/  # Testimonials management
│   │   │   ├── faqs/          # FAQ management
│   │   │   ├── inquiries/     # Contact leads tracking
│   │   │   └── settings/      # Global system settings
│   │   ├── api/               # Next.js API routes
│   │   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   │   ├── divisions/     # Division CRUD endpoints
│   │   │   ├── projects/      # Project CRUD endpoints
│   │   │   ├── testimonials/  # Testimonial CRUD endpoints
│   │   │   ├── faqs/          # FAQ CRUD endpoints
│   │   │   ├── inquiries/     # Inquiry management endpoints
│   │   │   ├── settings/      # Settings management
│   │   │   ├── media/         # File upload endpoint
│   │   │   └── redirect/[id]/ # Click tracking redirects
│   │   ├── sitemap.ts         # Dynamic XML sitemap
│   │   ├── robots.ts          # Search engine robots file
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── main/              # Public site components
│   │   │   ├── navbar.tsx     # Navigation bar
│   │   │   ├── hero.tsx       # Hero section
│   │   │   ├── divisions.tsx  # Business divisions grid
│   │   │   ├── footer.tsx     # Footer
│   │   │   └── [other sections]
│   │   └── ui/                # Shadcn UI primitives
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client instance
│   │   ├── query-provider.tsx # TanStack Query setup
│   │   └── utils.ts           # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # NextAuth & security middleware
├── .env.example               # Environment template
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
└── package.json               # Dependencies and scripts
```

---

## 🔑 Admin Panel Features

### Dashboard
- Real-time statistics: Projects, Divisions, Inquiries, Unread Messages
- Recent inquiries list
- Top performing projects by click count

### Content Management

**Business Divisions**
- Create, edit, delete business units
- Configure icons and color coding
- Sort order management

**Projects & IT Services**
- Complete project CRUD with drag-and-drop sorting
- Status tracking: ACTIVE, IN_DEVELOPMENT, MAINTENANCE, REDIRECTED
- SEO metadata per project
- Click analytics tracking

**Testimonials**
- Add, edit, delete testimonials
- Approval workflow for public display
- Star rating system (1-5)
- Avatar image upload

**FAQs**
- Manage frequently asked questions
- Sortable question-answer pairs
- Real-time search and filtering

**Contact Inquiries**
- View all submitted contact forms
- Mark as read/unread
- Assign administrative notes
- Delete spam/resolved inquiries

**Settings**
- Global SEO title and description
- Contact information
- Social media links
- Hero section text customization

---

## 🔒 Authentication & Authorization

The application uses **NextAuth v4** with a **Credentials Provider** and **JWT strategy**.

### Role-Based Access Control (RBAC)

| Feature | Super Admin | Editor | Auditor |
|---------|:-----------:|:------:|:-------:|
| Dashboard | ✅ | ✅ | ✅ |
| Content CRUD | ✅ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Inquiries | ✅ | ✅ | 👁️ Read-only |
| Audit Logs | ✅ | ❌ | 👁️ Read-only |

### Session Management
- **Strategy**: JWT-based
- **Duration**: 8 hours of inactivity
- **Secure Headers**: CSRF, XSS, Clickjacking protection enabled

---

## 📊 Database Schema

### Core Models

**User** - Admin system users with roles  
**BusinessDivision** - Medicxus Group's business units  
**Project** - IT services and products  
**Testimonial** - Customer testimonials  
**FAQ** - Frequently asked questions  
**ContactInquiry** - Public contact form submissions  
**SystemSetting** - Global configuration key-value pairs  
**AuditLog** - System activity tracking  

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema definition.

---

## 🎨 Design System

The platform strictly adheres to the **Sovereign Blue** design system.

### Color Palette
```
Primary Navy:     #0F4C81
Accent Teal:      #14B8A6
Highlight Amber:  #F59E0B
Deep Dark:        #0B1220
Canvas BG:        #F8FAFC
Body Text:        #475569
Heading:          #0F172A
Muted:            #94A3B8
```

### Typography
- **Headings**: Outfit (Weight: 600-900)
- **Body**: DM Sans (Weight: 300-600)

Configured in [tailwind.config.ts](tailwind.config.ts)

---

## 📝 API Documentation

### Public Endpoints

```
GET /api/divisions          - List all business divisions
GET /api/projects           - List all projects with filtering
GET /api/faqs               - List FAQs
GET /api/testimonials       - List approved testimonials
GET /api/redirect/[id]      - Redirect to project with click tracking
GET /sitemap.xml            - Dynamic XML sitemap
GET /robots.txt             - Search engine directives
```

### Admin Endpoints (Protected)

```
POST   /api/divisions              - Create division
PUT    /api/divisions/[id]         - Update division
DELETE /api/divisions/[id]         - Delete division

POST   /api/projects               - Create project
PUT    /api/projects/[id]          - Update project
DELETE /api/projects/[id]          - Delete project

POST   /api/testimonials           - Submit testimonial
PUT    /api/testimonials/[id]      - Update testimonial
DELETE /api/testimonials/[id]      - Delete testimonial

POST   /api/faqs                   - Create FAQ
PUT    /api/faqs/[id]              - Update FAQ
DELETE /api/faqs/[id]              - Delete FAQ

GET    /api/inquiries              - List contact inquiries
PUT    /api/inquiries/[id]         - Update inquiry (notes, read status)
DELETE /api/inquiries/[id]         - Delete inquiry

POST   /api/media                  - Upload media file
GET    /api/settings               - Get system settings
POST   /api/settings               - Update system settings
```

---

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

A production-grade Dockerfile is configured in the deployment plan. See PLAN_PART_3.md for containerization details.

### Environment Variables for Production

```env
DATABASE_URL="mysql://prod_user:secure_password@prod-db-server:3306/medicxus_prod"
NEXTAUTH_URL="https://medicxus.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NODE_ENV="production"
```

---

## 🧪 Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Seed database with demo data
npm run seed

# Generate Prisma types
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Run database migrations
npx prisma migrate dev --name <migration-name>
```

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and DATABASE_URL is correct in `.env.local`

### NextAuth Session Not Persisting
```
Error: Can't resolve next-auth/react
```
**Solution**: Reinstall dependencies: `rm -rf node_modules && npm install`

### File Upload Fails
```
Error: ENOENT: no such file or directory, open './public/uploads/...'
```
**Solution**: Create uploads directory: `mkdir -p public/uploads`

---

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Validation](https://zod.dev)

---

## 📄 License

This project is proprietary software for Medicxus Group. All rights reserved.

---

## 📞 Support

For technical support or inquiries, contact: **admin@medicxus.com**

---

**Last Updated**: June 1, 2026  
**Version**: 1.0.0
