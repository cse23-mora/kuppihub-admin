# KuppiHub Admin Panel

Admin dashboard for managing KuppiHub platform - modules, kuppis, users, and faculty hierarchy.

## Features

- 📊 **Dashboard** - Overview of platform statistics
- 👥 **Users Management** - View, edit, block/unblock, and delete users
- 📚 **Modules Management** - Add, edit, delete modules and assign them to faculties
- 🎥 **Kuppis Management** - Manage video content, approve/reject, hide/show
- 🏛️ **Hierarchy Management** - Manage faculty → department → semester structure
- ⚙️ **Settings** - Admin configuration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Firebase Auth (Google Sign-in)
- **Styling**: Tailwind CSS + MUI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project
- Firebase project

### Installation

1. Clone the repository and navigate to the admin folder:
```bash
cd kuppihub-admin
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example file and configure:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Admin Emails (comma separated)
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
kuppihub-admin/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── departments/
│   │   │   ├── faculties/
│   │   │   ├── hierarchy/
│   │   │   ├── kuppis/
│   │   │   ├── module-assignments/
│   │   │   ├── modules/
│   │   │   ├── semesters/
│   │   │   ├── stats/
│   │   │   └── users/
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── hierarchy/
│   │   │   ├── kuppis/
│   │   │   ├── modules/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Login page
│   │   └── providers.tsx
│   ├── components/
│   │   └── AdminLayout.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── lib/
│       ├── firebase.ts
│       └── supabase.ts
├── .env.example
├── next.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Admin Access

Only users with emails listed in `NEXT_PUBLIC_ADMIN_EMAILS` environment variable can access the admin panel. Add admin emails as a comma-separated list.

## API Endpoints

### Stats
- `GET /api/stats` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users
- `GET /api/users/[id]` - Get single user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Modules
- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create module
- `PATCH /api/modules/[id]` - Update module
- `DELETE /api/modules/[id]` - Delete module

### Module Assignments
- `GET /api/module-assignments` - Get all assignments
- `POST /api/module-assignments` - Create assignment
- `DELETE /api/module-assignments/[id]` - Delete assignment

### Kuppis
- `GET /api/kuppis` - Get all kuppis
- `POST /api/kuppis` - Create kuppi
- `PATCH /api/kuppis/[id]` - Update kuppi
- `DELETE /api/kuppis/[id]` - Delete kuppi

### Hierarchy
- `GET /api/hierarchy` - Get faculty hierarchy
- `PUT /api/hierarchy` - Update faculty hierarchy

### Faculties, Departments, Semesters
- `GET /api/faculties` - Get all faculties
- `GET /api/departments` - Get all departments
- `GET /api/semesters` - Get all semesters

## Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License
