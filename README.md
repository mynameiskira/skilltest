# SkillTest Platform

![CI Pipeline](https://github.com/mynameiskira/skilltest/actions/workflows/ci.yml/badge.svg)
![CD Pipeline](https://github.com/mynameiskira/skilltest/actions/workflows/cd.yml/badge.svg)


SkillTest is a comprehensive SaaS platform for automated technical assessments. It enables recruiters to evaluate candidates' skills through timed tests with cheat detection, automated scoring, and detailed analytics.

## 🚀 Features

- **Multi-Role System**: Dedicated dashboards for Admins, Recruiters, and Candidates.
- **Automated Grading**: Instant scoring for multiple question types.
- **Anti-Cheat System**: Real-time detection of focus loss and window switching.
- **Adaptive Difficulty Engine**: Questions adjust to candidate performance (Beta).
- **Manual Review**: Recruiters can review and override automated scores.
- **PDF Certification**: Automatic generation of certificates for passing grades.
- **Stripe Integration**: Subscription plans management for recruiters.

## 🛠 Tech Stack

- **Frontend**: Angular 18, Tailwind CSS, Signals
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (Dev) / MySQL (Prod) with Sequelize ORM
- **Infrastructure**: Docker, Nginx, GitHub Actions

## 🚦 Getting Started

### Prerequisites

- Node.js 20.x
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mynameiskira/skilltest.git
   cd skilltest
   ```

2. **Install dependencies**
   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

3. **Database Setup**
   ```bash
   cd server
   npx tsx seed.ts
   ```

4. **Run Development Server**
   ```bash
   # Terminal 1: Backend
   cd server
   npm run dev
   
   # Terminal 2: Frontend
   cd client
   npm start
   ```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 📦 Deployment

This project includes a complete CI/CD pipeline using GitHub Actions.
- Pushes to `main` trigger build and test workflows.
- Tagging a release (e.g., `v1.0.0`) triggers a deployment and Docker image build.

## 📄 License

Proprietary software. All rights reserved.
