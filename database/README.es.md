<h1 align="center">Database / Migrations 🗄️</h1>

Repositorio con esquemas y migraciones de base de datos usados por los
servicios. Contine:

- Definiciones de esquema Drizzle en `database/src/`.
- Migraciones SQL en `database/migration/` (generadas por Drizzle).
- Utilidades para aplicar migraciones durante el arranque de servicios (Bun).

> Generalmente el servicio de autenticación aplica migraciones al iniciar; los
> resto de servicios deben confiar/validar en el historial centralizado de
> migraciones.
