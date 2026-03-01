<h1 align="center">
  ☁️ Cloud Native Healthcare Platform 🏥
</h1>

<p align="center">
  Monorepo for a microservices-based healthcare platform, built with <strong>Bun + TypeScript</strong> and <strong>Java</strong>, using <strong>REST</strong> and <strong>SOAP</strong> APIs.
</p>

---

This repository groups the frontend, microservices, and shared packages under a
cloud-native architecture.

It can be used as a base template for enterprise projects with multiple
decoupled services. In this case, it implements a healthcare platform with
modules such as:

- 🗓️ Appointment management
- 📋 Electronic Health Records (EHR)
- 🛡️ Health insurance
- 🔐 Authentication and authorization
- 📦 Shared packages and centralized data layer

## 🏗️ Architecture and structure

```bash
.
├── apps/              # Frontend applications (e.g., web with Astro / React)
├── services/          # Microservices
│   ├── auth/          # TypeScript - Elysia
│   ├── appointment/   # Java - Quarkus
│   ├── ehr/           # Java - Quarkus
│   └── insurance/     # Java - Quarkus
├── shared/            # Shared packages
└── database/          # Data layer and migrations
```

### Technology stack

- **Frontend**: TypeScript with Astro / React
- **Auth Service**: TypeScript + Elysia (Bun runtime)
- **Core Microservices**: Java + Quarkus
- **Database**: PostgreSQL
- **Cache**: Redis
- **Local Infrastructure**: Docker Compose

> [!NOTE]
>
> Each package or module includes its own `README.md` with specific details and
> instructions. Additionally, if environment variables are required, a
> `.env.example` file is provided listing the necessary variables along with the
> corresponding documentation.

## 🚀 Quick start

### Run everything locally (container mode)

1. Install Docker.

2. Configure environment variables:
   - `.env`
   - `services/*/.env`

3. Start the full infrastructure:

   ```bash
   docker compose up --build
   ```

4. Access the endpoint documentation at
   [`http://localhost:4321/docs`](http://localhost:4321/docs).

## 🧑‍💻 Development

### Requirements

- Docker
- Bun
- Java 25
- Maven Wrapper (`mvnw` included in the repository)

### Local Development Steps

1. From the project root:

   ```bash
   bun install
   ./mvnw clean install -DskipTests
   ```

   On Windows:

   ```bat
   bun install
   .\mvnw clean install -DskipTests
   ```

2. Start base services (DB + Redis)

   ```bash
   docker compose -f docker-compose.dev.yml up
   ```

   Available services:
   - PostgreSQL
   - Redis
   - Drizzle Gateway → [http://localhost:4983](http://localhost:4983)
   - RedisInsight → [http://localhost:5540](http://localhost:5540)

3. Run applications
   - TypeScript (Bun)

     From the root:

     ```bash
     bun run --filter '*' dev
     ```

     Or inside each app:

     ```bash
     bun run dev
     ```

   - Java (Quarkus)

     From each microservice:

     ```bash
     ./mvnw quarkus:dev
     ```

     On Windows:

     ```bat
     .\mvnw quarkus:dev
     ```

     You can also use your preferred IDE to run in development mode.

> [!TIP]
>
> If you use Visual Studio Code:
>
> 1. Go to **Run and Debug**.
> 2. Select the `Healthcare 🐞` profile.
> 3. This will automatically start containers and services in debug mode.

## ℹ️ Additional implementation details

- Migrations are executed automatically when the authentication service starts
  (as it is the fastest to compile and run).

  > This approach was chosen because it best fits the current production
  > deployment model (without complex CI/CD pipelines).

- Each Java microservice has entity validation enabled using JPA/Hibernate
  annotations. This allows:
  - Schema validation at startup
  - Early detection of mapping errors
  - Reduced database-related runtime failures

If the project needs to be extended (new microservices, observability, CI/CD,
etc.), the structure is designed to scale without friction.
