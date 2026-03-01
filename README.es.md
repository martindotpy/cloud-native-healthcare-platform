<h1 align="center">
  ☁️ Cloud Native Healthcare Platform 🏥
</h1>

<p align="center">
  Monorepo para una plataforma de salud basada en microservicios, construida con <strong>Bun + TypeScript</strong> y <strong>Java</strong>, utilizando APIs <strong>REST</strong> y <strong>SOAP</strong>.
</p>

---

Este repositorio agrupa frontend, microservicios y paquetes compartidos bajo una
arquitectura cloud native.

Puede utilizarse como plantilla base para proyectos empresariales con múltiples
servicios desacoplados. En este caso, implementa una plataforma de salud con
módulos como:

- 🗓️ Gestión de citas
- 📋 Historia Clínica Electrónica (HCE)
- 🛡️ Seguros médicos
- 🔐 Autenticación y autorización
- 📦 Paquetes compartidos y capa de datos centralizada

## 🏗️ Arquitectura y estructura

```bash
.
├── apps/              # Aplicaciones frontend (ej. web con Astro / React)
├── services/          # Microservicios
│   ├── auth/          # TypeScript - Elysia
│   ├── appointment/   # Java - Quarkus
│   ├── ehr/           # Java - Quarkus
│   └── insurance/     # Java - Quarkus
├── shared/            # Paquetes compartidos
└── database/          # Capa de datos y migraciones
```

### Detalle tecnológico

- **Frontend**: TypeScript con Astro / React
- **Auth Service**: TypeScript + Elysia (Bun runtime)
- **Microservicios core**: Java + Quarkus
- **Base de datos**: PostgreSQL
- **Cache**: Redis
- **Infraestructura local**: Docker Compose

> [!NOTE]
>
> Cada paquete o módulo incluye su propio `README.md` con información y detalles
> específicos. Además, si requiere variables de entorno, contará con un archivo
> `.env.example` que enumera las variables necesarias para su correcto
> funcionamiento, junto con la documentación correspondiente.

## 🚀 Quick Start

### Ejecutar todo en local (modo contenedor)

1. Instala Docker.
2. Configura las variables de entorno:
   - `.env`
   - `services/*/.env`

3. Levanta la infraestructura completa:

   ```bash
   docker compose up --build
   ```

4. Accede a la documentación de endpoints en
   [`http://localhost:4321/docs`](http://localhost:4321/docs).

## 🧑‍💻 Desarrollo

### Requisitos

- Docker
- Bun
- Java 25
- Maven Wrapper (`mvnw` incluido en el repo)

### Pasos para desarrollo local

1. Desde la raíz del proyecto:

   ```bash
   bun install
   ./mvnw clean install -DskipTests
   ```

   En Windows:

   ```bat
   bun install
   .\mvnw clean install -DskipTests
   ```

2. Levantar servicios base (DB + Redis)

   ```bash
   docker compose -f docker-compose.dev.yml up
   ```

   Servicios disponibles:
   - PostgreSQL
   - Redis
   - Drizzle Gateway → [http://localhost:4983](http://localhost:4983)
   - RedisInsight → [http://localhost:5540](http://localhost:5540)

3. Ejecutar aplicaciones
   - TypeScript (Bun)

     Desde la raíz:

     ```bash
     bun run --filter '*' dev
     ```

     O dentro de cada app:

     ```bash
     bun run dev
     ```

   - Java (Quarkus)

     Desde cada microservicio:

     ```bash
     ./mvnw quarkus:dev
     ```

     En Windows:

     ```bat
     .\mvnw quarkus:dev
     ```

     También puedes usar tu IDE favorito para ejecutar en modo desarrollo.

> [!TIP]
>
> Si utilizas Visual Studio Code:
>
> 1. Ve a **Run and Debug**.
> 2. Selecciona el perfil `Healthcare 🐞`.
> 3. Esto levantará contenedores y servicios en modo debug automáticamente..

## ℹ️ Información adicional de la implementación

- Las migraciones se ejecutan automáticamente al iniciar el servicio de
  autenticación (por ser el más rápido de compilar y levantar).

  > Se realiza de esta manera porque es como mejor se adapta a la forma actual
  > en la que se despliega a producción (sin pipelines de CI/CD complejos).

- Cada microservicio en Java tiene habilitada la validación de entidades
  mediante anotaciones JPA/Hibernate. Esto permite:
  - Validar el esquema en tiempo de arranque
  - Detectar errores de mapeo antes de producción
  - Reducir fallos relacionados con la base de datos en runtime

Si se necesita extender el proyecto (nuevos microservicios, observabilidad,
CI/CD, etc.), la estructura está preparada para escalar sin fricción.
