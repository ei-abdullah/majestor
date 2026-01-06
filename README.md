# 🎓 Majestor

> A comprehensive academic resource sharing and lost & found platform for universities

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.30-000020.svg)](https://expo.dev/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Validation Rules](#-validation-rules)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

**Majestor** is a full-stack mobile application designed to facilitate academic resource sharing and lost & found services within university communities. Students can share educational materials, find lost items, and connect with their academic community through a modern, intuitive interface.

### Key Highlights

- 📚 **Document Sharing**: Upload and download past papers, notes, assignments, and projects
- 🔍 **Lost & Found**: Report lost items and help others find their belongings
- 👥 **User Management**: Secure authentication with university email validation
- 🎨 **Modern UI**: Beautiful gradient designs reflecting brand identity
- 🔐 **Security**: JWT-based authentication with role-based access control

---

## ✨ Features

### 📱 Mobile App (React Native + Expo)

#### Authentication & User Management
- ✅ Secure login/signup with CUST email validation (`@cust.pk`)
- ✅ JWT token-based authentication with refresh tokens
- ✅ User profile management with avatar upload
- ✅ University and faculty association
- ✅ Role-based access (Student, Admin, etc.)

#### Document Management
- ✅ Upload documents with multiple images
- ✅ Advanced filtering (course, type, year, semester)
- ✅ Like/unlike documents
- ✅ Download documents with permission handling
- ✅ Document preview with image carousel
- ✅ Sort by likes (most/least)

#### Lost & Found
- ✅ Report lost items with images and location
- ✅ Mark items as found
- ✅ Contact lost item owners via phone

#### UI/UX Features
- ✅ Gradient tab bar with active state highlighting
- ✅ Form validation with react-hook-form
- ✅ Real-time error handling
- ✅ Loading states and error boundaries
- ✅ Toast notifications
- ✅ Responsive design with NativeWind (TailwindCSS)

### 🔧 Backend API (Spring Boot)

#### RESTful API
- ✅ Complete CRUD operations for all entities
- ✅ JWT authentication and authorization
- ✅ Role-based access control
- ✅ File upload/download handling
- ✅ Pagination and filtering
- ✅ Input validation with custom regex patterns

#### Database
- ✅ PostgreSQL database
- ✅ JPA/Hibernate ORM
- ✅ Optimized queries with indexes
- ✅ Relationship management (OneToMany, ManyToOne)

#### Security
- ✅ Spring Security configuration
- ✅ Password hashing with BCrypt
- ✅ CORS configuration
- ✅ Request/Response validation

#### Documentation
- ✅ Swagger/OpenAPI integration
- ✅ Detailed API endpoints documentation

---

## 🛠 Tech Stack

### Frontend (Mobile)

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | ~54.0.30 | Development platform |
| TypeScript | ~5.9.2 | Type safety |
| React Hook Form | ^7.68.0 | Form management |
| TanStack Query | ^5.90.12 | Server state management |
| Zustand | ^5.0.9 | Client state management |
| NativeWind | ^4.2.1 | Styling (TailwindCSS) |
| Axios | ^1.13.2 | HTTP client |
| Expo Router | ~6.0.21 | File-based routing |

### Backend (API)

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.6 | Java framework |
| Java | 21 | Programming language |
| PostgreSQL | Latest | Database |
| Spring Security | - | Authentication/Authorization |
| JWT | 0.12.6 | Token-based auth |
| Spring Data JPA | - | Database ORM |
| Lombok | Latest | Boilerplate reduction |
| Hibernate Validator | - | Input validation |
| Swagger/OpenAPI | 2.7.0 | API documentation |

### DevOps & Tools

- **Docker**: Containerization (PostgreSQL)
- **Maven**: Build automation (Backend)
- **npm/yarn**: Package management (Frontend)
- **Git**: Version control

---

## 📁 Project Structure

```
majestor/
├── apps/
│   ├── api/                          # Spring Boot Backend
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/com/majestor/api/
│   │   │   │   │   ├── modules/
│   │   │   │   │   │   ├── academia/           # Universities & Faculties
│   │   │   │   │   │   ├── auth/               # Authentication
│   │   │   │   │   │   ├── document/           # Document management
│   │   │   │   │   │   ├── lostfound/          # Lost & Found
│   │   │   │   │   │   └── user/               # User management
│   │   │   │   │   ├── config/                 # Configuration classes
│   │   │   │   │   └── MajestorApiApplication.java
│   │   │   │   └── resources/
│   │   │   │       └── application.yml          # App configuration
│   │   │   └── test/
│   │   ├── pom.xml                              # Maven dependencies
│   │   └── mvnw                                 # Maven wrapper
│   │
│   └── mobile/                       # React Native App
│       ├── src/
│       │   ├── app/                             # Expo Router pages
│       │   │   ├── (auth)/                      # Auth screens
│       │   │   └── (tabs)/                      # Tab navigation
│       │   ├── components/
│       │   │   ├── screens/                     # Screen components
│       │   │   └── ui/                          # Reusable UI components
│       │   ├── constants/                       # App constants
│       │   ├── hooks/                           # Custom hooks
│       │   ├── queries/                         # React Query hooks
│       │   ├── services/                        # API services
│       │   ├── stores/                          # Zustand stores
│       │   └── utils/                           # Utility functions
│       ├── assets/                              # Images & fonts
│       ├── package.json
│       └── app.json                             # Expo configuration
│
├── logs/                             # Application logs
├── docker-compose.yml                # Docker services
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md                         # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### For Backend Development
- ☕ **Java 21** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- 🔨 **Maven 3.8+** (or use included Maven wrapper)
- 🐘 **PostgreSQL** (or Docker)
- 📝 IDE: IntelliJ IDEA, Eclipse, or VS Code

### For Mobile Development
- 📱 **Node.js 18+** ([Download](https://nodejs.org/))
- 📦 **npm** or **yarn**
- 📲 **Expo CLI**: `npm install -g expo-cli`
- 📱 **Expo Go** app on your mobile device
- 🤖 **Android Studio** (for Android) or **Xcode** (for iOS)

### General Tools
- 🐋 **Docker** & **Docker Compose** (optional, for PostgreSQL)
- 🔧 **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/majestor.git
cd majestor
```

### 2. Backend Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d

# Navigate to API directory
cd apps/api

# Run the application
./mvnw spring-boot:run
```

#### Option B: Manual PostgreSQL Setup

```bash
# Install PostgreSQL and create database
createdb majestor_db

# Create user
psql -c "CREATE USER majestor WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE majestor_db TO majestor;"

# Navigate to API directory
cd apps/api

# Configure application.yml (see Configuration section)

# Run the application
./mvnw spring-boot:run
```

### 3. Mobile App Setup

```bash
# Navigate to mobile directory
cd apps/mobile

# Install dependencies
npm install
# or
yarn install

# Start Expo development server
npm start
# or
expo start
```

---

## ⚙️ Configuration

### Backend Configuration

Create or update `apps/api/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/majestor_db
    username: ${POSTGRES_USER:majestor}
    password: ${POSTGRES_PASSWORD:your_password}
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

jwt:
  secret: ${JWT_SECRET:your-secret-key-here}
  expiration: 86400000  # 24 hours
  refresh-expiration: 604800000  # 7 days

server:
  port: 8080
```

### Environment Variables

Create `.env` file in the root directory:

```env
# Database
POSTGRES_DB=majestor_db
POSTGRES_USER=majestor
POSTGRES_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-256-bit-secret-key-change-this-in-production

# API
API_BASE_URL=http://localhost:8080
```

### Mobile App Configuration

Update `apps/mobile/src/services/index.ts` with your API URL:

```typescript
export const API_BASE_URL = "http://localhost:8080";  // For Android emulator use 10.0.2.2
```

---

## 🏃 Running the Project

### Backend (API)

```bash
cd apps/api

# Development mode
./mvnw spring-boot:run

# Build JAR
./mvnw clean package

# Run JAR
java -jar target/api-0.0.1-SNAPSHOT.jar
```

**API will be available at:** `http://localhost:8080`

### Mobile App

```bash
cd apps/mobile

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run in web browser
npm run web
```

**Scan QR code** with Expo Go app to run on your device.

---

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Key API Endpoints

#### Authentication
```
POST   /api/auth/signup          # Register new user
POST   /api/auth/login           # Login user
POST   /api/auth/refresh-token   # Refresh access token
```

#### Users
```
GET    /api/users/{id}           # Get user details
PUT    /api/users/{id}           # Update user details
POST   /api/users/{id}/avatar    # Upload avatar
```

#### Documents
```
GET    /api/documents            # List documents (with filters)
POST   /api/documents            # Upload document
GET    /api/documents/{id}       # Get document details
POST   /api/documents/{id}/like  # Like/unlike document
GET    /api/documents/{id}/download  # Download document
```

#### Lost & Found
```
GET    /api/lostfound/lost-items      # List lost items
POST   /api/lostfound/lost-items      # Report lost item
GET    /api/lostfound/lost-items/{id} # Get lost item details
```

#### Academia
```
GET    /api/academia/universities     # List universities
GET    /api/academia/courses          # List courses
```

---

## ✅ Validation Rules

### Email Validation

#### University Email (Required for Auth)
- **Pattern**: `^[a-zA-Z0-9._%+-]+@cust\.pk$`
- **Must end with**: `@cust.pk`
- **Example**: ✅ `john.doe@cust.pk` | ❌ `john@gmail.com`

#### Personal Email (Optional)
- **Pattern**: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
- **Standard email format**
- **Example**: ✅ `john.doe@gmail.com`

### Phone Validation

#### Pakistani Mobile Format
- **Pattern**: `^03[0-9]{9}$`
- **Format**: 11 digits starting with `03`
- **Example**: ✅ `03001234567` | ❌ `3001234567`

### Form Validation

All forms use **react-hook-form** with:
- ✅ Real-time validation
- ✅ Custom error messages
- ✅ Disabled submit on errors
- ✅ Dirty state tracking

---

## 🎨 Design System

### Brand Colors

```css
/* Primary Gradient */
--gradient-start: #3A6FF8  /* Blue */
--gradient-end: #8DDDD3    /* Teal/Cyan */

/* Background */
--bg-light: #EFF3FA
--bg-lighter: #E6EBF5

/* Text */
--text-primary: #1F2937
--text-secondary: #6B7280
```

### UI Components

- **Gradient Buttons**: Primary actions with blue→teal gradient
- **Tab Bar**: Active tabs show gradient background (56x56px, 12px radius)
- **Cards**: White background with subtle shadows
- **Inputs**: Rounded corners with icon support

---

## 🧪 Testing

### Backend Tests

```bash
cd apps/api
./mvnw test
```

### Mobile Tests

```bash
cd apps/mobile
npm test
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Backend**: Follow Java conventions, use Lombok, document public APIs
- **Frontend**: Use TypeScript, follow React hooks patterns, use functional components
- **Formatting**: Run linters before committing
- **Commits**: Use conventional commit messages

---

## 📝 Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct.

---

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check if PostgreSQL is running
docker ps  # or
pg_isready

# Check port 8080 is available
lsof -i :8080  # Kill process if needed
```

#### Mobile app can't connect to API
- Android Emulator: Use `10.0.2.2` instead of `localhost`
- iOS Simulator: Use `localhost`
- Physical Device: Use computer's IP address

#### Database connection error
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

See also the list of [contributors](https://github.com/yourusername/majestor/contributors) who participated in this project.

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Expo team for React Native development tools
- All contributors and testers

---

## 📞 Support

For support, email support@majestor.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### Version 1.1
- [ ] Push notifications for new documents
- [ ] Real-time chat between users
- [ ] Document comments and ratings
- [ ] Advanced search with filters

### Version 2.0
- [ ] AI-powered document recommendations
- [ ] OCR for document text extraction
- [ ] Multi-language support
- [ ] Dark mode theme

---

<div align="center">
  <p>Made with ❤️ by the Majestor Team</p>
  <p>
    <a href="https://github.com/yourusername/majestor">⭐ Star us on GitHub</a> •
    <a href="https://github.com/yourusername/majestor/issues">🐛 Report Bug</a> •
    <a href="https://github.com/yourusername/majestor/issues">✨ Request Feature</a>
  </p>
</div>

