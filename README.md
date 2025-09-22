# 🎓 Course Enrollment API

> A modern backend service for managing courses and student enrollments with TypeScript and PostgreSQL

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

---

## ✨ Features

- 🔐 **JWT Authentication** to protect sensitive endpoints
- 🗄️ **Database ORM** with Prisma and PostgreSQL
- ⚡ **Redis caching** for improved performance
- 📚 **Interactive API docs** with Swagger UI
- ✅ **Input validation** with Zod schemas
- 📄 **Pagination & Filtering** for efficient data retrieval
- 🧪 **Comprehensive Testing** with Jest (Unit + Integration)
- 🏗️ **Clean architecture** with separation of concerns

## 🛠️ Tech Stack

| Technology            | Purpose                            |
| --------------------- | ---------------------------------- |
| **Node.js + Express** | Backend framework                  |
| **TypeScript**        | Type safety & developer experience |
| **Prisma ORM**        | Database management & migrations   |
| **PostgreSQL**        | Production database                |
| **Redis**             | Caching & session management       |
| **Swagger UI**        | API documentation                  |
| **Zod**               | Runtime type checking & validation |
| **Jest + Supertest**  | Testing framework                  |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd exercise

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Setup

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/course_db"

# Server
PORT=8080
NODE_ENV=development

# Redis (optional)
REDIS_HOST_1=localhost
REDIS_PORT_1=6379
REDIS_HOST_2=localhost
REDIS_PORT_2=6380
REDIS_HOST_3=localhost
REDIS_PORT_3=6381
```

### Docker Setup

This project uses Docker to run Backend (Node + Prisma), Frontend (Next.js), and PostgreSQL in isolated containers.
Accessing Services

Backend: http://localhost:8080
Swagger API docs: http://localhost:8080/api-docs
Frontend: http://localhost:3000
Database: PostgreSQL running on port 5432 inside Docker.

```bash
docker-compose up --build
docker-compose logs -f
docker-compose stop
docker-compose down -v
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push
npx prisma migrate dev --name init

# Seed sample data
npx ts-node prisma/seed.ts
```

### Start Development Server

```bash
npm run dev
```

🎉 **Server running at:** http://localhost:3000  
📖 **API Documentation:** http://localhost:3000/api-docs

---

## 📚 API Documentation

### Endpoints Overview

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| `GET`  | `/api/courses`                     | List all courses         |
| `POST` | `/api/courses`                     | Create a new course      |
| `POST` | `/api/enrollments`                 | Enroll student in course |
| `GET`  | `/api/students/:email/enrollments` | Get student enrollments  |

### Example Requests

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

#### Create a Course

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Advanced TypeScript",
    "description": "Deep dive into TypeScript",
    "code": "TS301",
    "difficulty": "Advanced"
  }'
```

#### Enroll in a Course

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "studentEmail": "student@example.com",
    "courseCode": "NODE101"
  }'
```

---

## 📁 Project Structure

```
exercise/
├─ backend/
│  ├─ 📂 controllers/           # Business logic layer
│     ├── course.controller.ts
│     └── enrollment.controller.ts
│     └── login.controller.ts
│  ├─ 📂 middlewares/          # Express middlewares
│     └── validate.middleware.ts
│     └── auth.middleware.ts
│  ├─📂 routes/               # API route definitions
│     ├── index.route.ts
│     ├── course.route.ts
│     └── enrollment.route.ts
│     └── login.route.ts
│  ├─📂 schemas/              # Validation schemas
│     ├── course.schema.ts
│     └── enrollment.schema.ts
│  ├─📂 prisma/               # Database configuration
│     ├── schema.prisma
│     └── seed.ts
│  ├─ 📂 utils/               # Builder Pagination, filters and search,...
│     ├── queryBuilder.ts
│  ├─ 📂 swagger/              # API documentation
│     └── swagger.ts
│  ├─ 📄 index.ts              # Application entry point
│  ├─  📄 .env                  # Environment variables
│  ├─ 📄 tsconfig.json         # TypeScript configuration
│  ├─ Dockerfile
├─ frontend/
│  ├─ Dockerfile
└── 📄 docker-compose.yml
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your-migration-name
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by <strong>Your Name</strong></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
